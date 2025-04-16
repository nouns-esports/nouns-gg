import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { inArray } from "drizzle-orm";
import { nounDelegates } from "~/packages/db/schema/indexer";

export const becomeDelegate = createAction({
	create: async () => {
		return {
			description: <p>Become a Nouns delegate</p>,
			url: "https://nouns.camp",
			check: async (user) => {
				if (user.wallets.length === 0) return false;

				const isDelegate = await db.primary.query.nounDelegates.findFirst({
					where: inArray(
						nounDelegates.to,
						user.wallets.map((w) => w.address as `0x${string}`),
					),
				});

				return !!isDelegate;
			},
		};
	},
});
