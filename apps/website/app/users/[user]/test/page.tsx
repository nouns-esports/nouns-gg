import { getAuthenticatedUser } from "@/server/queries/users";
import { db } from "~/packages/db";
import { erc721Balances, nounDelegates } from "~/packages/db/schema/indexer";
import { inArray } from "drizzle-orm";

export default async function TestPage() {
	console.log("test", Object.keys(db.query.erc721Balances));
	const user = await getAuthenticatedUser();

	if (!user) {
		return <div>Not logged in</div>;
	}
	console.log(
		"test0",
		Object.keys(
			// @ts-ignore
			db.query?.erc721BalancesInIndexer,
		),
	);

	const balances = await db.query.erc721Balances.findMany({
		limit: 10,
	});

	// const balances = await db.query.erc721Balances.findMany({
	// 	where: inArray(
	// 		erc721Balances.account,
	// 		user.wallets.map((wallet) => wallet.address as `0x${string}`),
	// 	),
	// });

	return (
		<div className="p-64 text-white">
			<div>
				{balances.map((balance) => (
					<div key={`${balance.account}:${balance.tokenId}`}>
						{balance.account}:{balance.tokenId}
					</div>
				))}
			</div>
		</div>
	);
}
