import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { inArray } from "drizzle-orm";
import { nounDelegates } from "~/packages/db/schema/indexer";

export const becomeNounsDelegate = createAction({
	image: "",
	name: "Nouns Delegate",
	category: "nouns",
	generateDescription: async () => {
		"use server";

		return [
			{
				text: "Become a",
			},
			{
				text: "Nouns",
				href: "https://nouns.camp",
			},
			{
				text: "delegate",
			},
		];
	},
	check: async ({ user }) => {
		"use server";

		if (user.wallets.length === 0) return false;

		const isDelegate = await db.primary.query.nounDelegates.findFirst({
			where: inArray(
				nounDelegates.to,
				user.wallets.map((w) => w.address.toLowerCase() as `0x${string}`),
			),
		});

		return !!isDelegate;
	},
	filters: {},
});
