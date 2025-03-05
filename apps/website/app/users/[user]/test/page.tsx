import { getAuthenticatedUser } from "@/server/queries/users";
import { db } from "~/packages/db";
import { erc721Balances, nounDelegates } from "~/packages/db/schema/indexer";
import { inArray } from "drizzle-orm";

export default async function TestPage() {
	const user = await getAuthenticatedUser();

	if (!user) {
		return <div>Not logged in</div>;
	}

	const someDelegates = await db.query.nounDelegates.findMany({
		limit: 10,
	});

	const myDelegate = await db.query.nounDelegates.findFirst({
		where: inArray(
			nounDelegates.to,
			user.wallets.map((wallet) => wallet.address as `0x${string}`),
		),
	});

	const balances = await db.query.erc721Balances.findMany({
		where: inArray(
			erc721Balances.account,
			user.wallets.map((wallet) => wallet.address as `0x${string}`),
		),
	});

	return (
		<div className="p-64 text-white">
			<div>
				{someDelegates.map((delegate) => (
					<div key={`${delegate.from}:${delegate.to}`}>
						{delegate.from}:{delegate.to}
					</div>
				))}
			</div>
			<div>
				{myDelegate?.from}:{myDelegate?.to}
			</div>
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
