import { eq } from "ponder";
import { and } from "ponder";
import {
	createPublicClient,
	getAbiItem,
	http,
	toFunctionSelector,
	type Abi,
	type AbiFunction,
} from "viem";
import * as chains from "viem/chains";
import { env } from "~/env";
import { db } from "~/packages/db";
import { cachedContractReads } from "~/packages/db/schema/public";
import {
	type ReadContractParameters,
	type ReadContractReturnType,
	type ContractFunctionArgs,
	type ContractFunctionName,
} from "viem";
import superjson from "superjson";

export const supportedChains = {
	base: http(`https://base-mainnet.infura.io/v3/${env.INFURA_API_KEY}`),
	baseSepolia: http(`https://base-sepolia.infura.io/v3/${env.INFURA_API_KEY}`),
	mainnet: http(`https://mainnet.infura.io/v3/${env.INFURA_API_KEY}`),
	sepolia: http(`https://sepolia.infura.io/v3/${env.INFURA_API_KEY}`),
	mantle: http(`https://mantle-mainnet.infura.io/v3/${env.INFURA_API_KEY}`),
} as const;

export function viemClient(chain: keyof typeof supportedChains) {
	const client = createPublicClient({
		chain: chains[chain],
		transport: supportedChains[chain],
	});

	return {
		...client,
		readContract: async <
			TAbi extends Abi | readonly unknown[],
			TFn extends ContractFunctionName<TAbi, "view" | "pure">,
			TArgs extends ContractFunctionArgs<TAbi, "view" | "pure", TFn>,
		>(
			params: ReadContractParameters<TAbi, TFn, TArgs>,
		): Promise<ReadContractReturnType<TAbi, TFn, TArgs>> => {
			const selector = toFunctionSelector(
				Array.isArray(params.abi)
					? (getAbiItem({
							abi: params.abi as Abi,
							name: params.functionName as string,
						}) as AbiFunction)
					: (params.abi as AbiFunction),
			);

			if (params.blockNumber && params.address) {
				const cachedRead = await db.pgpool.query.cachedContractReads.findFirst({
					where: and(
						eq(cachedContractReads.chain, chain),
						eq(cachedContractReads.block, Number(params.blockNumber)),
						eq(cachedContractReads.address, params.address),
						eq(cachedContractReads.selector, selector),
						eq(cachedContractReads.args, superjson.stringify(params.args)),
					),
				});

				if (cachedRead) {
					return superjson.parse(cachedRead.result) as ReadContractReturnType<
						TAbi,
						TFn,
						TArgs
					>;
				}
			}

			const result = await client.readContract(params);

			if (params.blockNumber && params.address) {
				await db.pgpool
					.insert(cachedContractReads)
					.values({
						chain,
						block: Number(params.blockNumber),
						address: params.address,
						selector,
						args: superjson.stringify(params.args),
						result: superjson.stringify(result),
					})
					.onConflictDoNothing();
			}

			return result;
		},
	};
}
