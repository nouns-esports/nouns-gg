import { z } from "zod";
import { createAction } from "../createAction";
import { createFilter } from "../createFilter";
import { db } from "~/packages/db";
import { erc721Balances } from "~/packages/db/schema/indexer";
import { inArray, and, eq } from "drizzle-orm";

export const holdNFT = createAction({
	name: "Hold NFT",
	category: "onchain",
	image: "",
	generateDescription: async (inputs) => {
		if (inputs.amount?.min) {
			return [
				{ text: "Hold at least" },
				{ text: inputs.amount.min.toString() },
				{ text: "of" },
				{
					text: `${inputs.token.label}${inputs.token.id ? ` #${inputs.token.id}` : ""}`,
				},
			];
		}

		return [
			{ text: "Hold a" },
			{
				text: `${inputs.token.label}${inputs.token.id ? ` #${inputs.token.id}` : ""}`,
			},
		];
	},
	check: async ({ inputs, user }) => {
		if (user.wallets.length === 0) return false;

		const isHolder = await db.primary.query.erc721Balances.findMany({
			where: and(
				inArray(
					erc721Balances.account,
					user.wallets.map((w) => w.address as `0x${string}`),
				),
				eq(erc721Balances.collection, inputs.token.address),
				inputs.token.id
					? eq(erc721Balances.tokenId, BigInt(inputs.token.id))
					: undefined,
			),
		});

		if (inputs.amount?.min) {
			return isHolder.length >= inputs.amount.min;
		}

		return isHolder.length > 0;
	},
	validateInputs: async ({ inputs, ctx }) => {
		if (inputs.amount?.min !== undefined && inputs.token.id !== undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Can't specify a minimum amount and a specific token ID",
			});
		}
	},
	filters: {
		token: createFilter({
			options: {
				address: {
					name: "Address",
					description: "The address of the NFT to hold",
					schema: z.string(),
				},
				id: {
					name: "Token ID",
					description: "The ID of the NFT to hold",
					schema: z.string().optional(),
				},
				label: {
					name: "Label",
					description: "The label of the NFT to hold",
					schema: z.string(),
				},
			},
			name: "Token",
			required: true,
		}),
		amount: createFilter({
			options: {
				min: {
					name: "At least",
					description: "The minimum amount of NFTs to hold",
					schema: z.number(),
				},
			},
			name: "Amount",
		}),
	},
});
