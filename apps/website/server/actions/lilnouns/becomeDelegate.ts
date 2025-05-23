import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { and, eq, inArray } from "drizzle-orm";
import { erc721Balances, lilnounDelegates } from "~/packages/db/schema/indexer";

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

		const [isDelegate, isHolder] = await Promise.all([
			db.primary.query.lilnounDelegates.findFirst({
				where: inArray(
					lilnounDelegates.to,
					user.wallets.map((w) => w.address.toLowerCase() as `0x${string}`),
				),
			}),
			db.primary.query.erc721Balances.findFirst({
				where: and(inArray(
					erc721Balances.account,
					user.wallets.map((w) => w.address.toLowerCase() as `0x${string}`),
				),
					eq(erc721Balances.collection, "0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b"),
				),
			}),
		]);

		return !!isDelegate || !!isHolder;
	},
	filters: {},
});
