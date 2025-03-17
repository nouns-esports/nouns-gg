import createAction from "../createAction";
import { db } from "~/packages/db";
import { lilnounDelegates, nounDelegates } from "~/packages/db/schema/indexer";
import { inArray } from "drizzle-orm";

export const becomeDelegate = createAction<{
	url?: string;
	tokenName?: string;
}>(async (actionInputs) => {
	if (!actionInputs.url) {
		throw new Error("URL is required");
	}

	return {
		description: <p>Become a {actionInputs.tokenName ?? ""} delegate</p>,
		url: actionInputs.url,
		check: async (user) => {
			const delegation =
				actionInputs.tokenName === "Noun"
					? await db.primary.query.nounDelegates.findFirst({
							where: inArray(
								nounDelegates.to,
								user.wallets.map((w) => w.address as `0x${string}`),
							),
						})
					: await db.primary.query.lilnounDelegates.findFirst({
							where: inArray(
								lilnounDelegates.to,
								user.wallets.map((w) => w.address as `0x${string}`),
							),
						});

			if (delegation) return true;

			return false;
		},
	};
});
