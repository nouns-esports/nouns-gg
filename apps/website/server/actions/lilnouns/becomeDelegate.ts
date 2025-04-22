import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { inArray } from "drizzle-orm";
import { lilnounDelegates } from "~/packages/db/schema/indexer";

export const becomeLilNounsDelegate = createAction({
	image: "",
	name: "Lil Nouns Delegate",
	category: "lilnouns",
	generateDescription: async () => {
		"use server";

		return [
			{
				text: "Become a",
			},
			{
				text: "Lil Nouns",
				href: "https://lilnouns.camp",
			},
			{
				text: "delegate",
			},
		];
	},
	check: async ({ user }) => {
		"use server";

		if (user.wallets.length === 0) return false;

		const isDelegate = await db.primary.query.lilnounDelegates.findFirst({
			where: inArray(
				lilnounDelegates.to,
				user.wallets.map((w) => w.address as `0x${string}`),
			),
		});

		return !!isDelegate;
	},
	filters: {},
});
