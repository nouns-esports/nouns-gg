import createAction from "../createAction";
import { db } from "~/packages/db";
import { erc721Balances } from "~/packages/db/schema/indexer";
import { and, eq, inArray } from "drizzle-orm";

export const holdERC721 = createAction<{
	contract?: string;
	tokenName?: string;
	url?: string;
}>(async (actionInputs) => {
	if (!actionInputs.contract) {
		throw new Error("Contract Address is required");
	}

	if (!actionInputs.tokenName) {
		throw new Error("Token Name is required");
	}

	if (!actionInputs.url) {
		throw new Error("URL is required");
	}

	return {
		description: <p>Acquire a {actionInputs.tokenName}</p>,
		url: actionInputs.url,
		check: async (user) => {
			const balance = await db.primary.query.erc721Balances.findFirst({
				where: and(
					eq(
						erc721Balances.collection,
						actionInputs.contract?.toLowerCase() as `0x${string}`,
					),
					inArray(
						erc721Balances.account,
						user.wallets.map((w) => w.address.toLowerCase() as `0x${string}`),
					),
				),
			});

			if (balance) return true;

			return false;
		},
	};
});
