import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { inArray } from "drizzle-orm";
import { lilnounDelegates } from "~/packages/db/schema/indexer";

export const becomeDelegate = createAction({
	create: async () => {
		return {
			description: <p>Become a Lil Nouns delegate</p>,
			url: "https://lilnouns.wtf",
			check: async (user) => {
				if (user.wallets.length === 0) return false;

				const isDelegate = await db.primary.query.lilnounDelegates.findFirst({
					where: inArray(
						lilnounDelegates.to,
						user.wallets.map((w) => w.address as `0x${string}`),
					),
				});

				return !!isDelegate;
			},
		};
	},
});
