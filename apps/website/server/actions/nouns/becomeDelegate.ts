import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { and, eq, inArray } from "drizzle-orm";
import { erc721Balances, nounDelegates } from "~/packages/db/schema/indexer";

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

		console.log("Action user", user, user.wallets)

		if (user.wallets.length === 0) return false;

		const [isDelegate, isHolder] = await Promise.all([
			db.primary.query.nounDelegates.findFirst({
				where: inArray(
					nounDelegates.to,
					user.wallets.map((w) => w.address.toLowerCase() as `0x${string}`),
				),
			}),
			db.primary.query.erc721Balances.findFirst({
				where: and(inArray(
					erc721Balances.account,
					user.wallets.map((w) => w.address.toLowerCase() as `0x${string}`),
				),
					eq(erc721Balances.collection, "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03"),
				),
			}),
		]);

		return !!isDelegate || !!isHolder;
	},
	filters: {},
});
