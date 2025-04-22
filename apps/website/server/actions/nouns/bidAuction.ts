import { db } from "~/packages/db";
import { createAction } from "../createAction";
import { nounsBids } from "~/packages/db/schema/indexer";
import { and, gte, inArray } from "drizzle-orm";
import { createFilter } from "../createFilter";
import { z } from "zod";

export const bidAuction = createAction({
	image: "",
	name: "Bid Auction",
	category: "nouns",
	generateDescription: async (inputs) => {
		"use server";

		const parts = [];

		parts.push({
			text: "Bid",
		});

		if (inputs.amount) {
			parts.push({
				text: "at least",
			});
			parts.push({
				text: `${inputs.amount.min} ETH`,
				highlight: true,
			});
		}

		parts.push({
			text: "on a",
		});

		parts.push({
			text: "Nouns Auction",
			link: "https://www.nouns.camp/?auction=1",
		});

		return parts;
	},
	check: async ({ user, inputs }) => {
		"use server";

		if (user.wallets.length === 0) return false;

		const bid = await db.primary.query.nounsBids.findFirst({
			where: and(
				inArray(
					nounsBids.bidder,
					user.wallets.map((w) => w.address as `0x${string}`),
				),
				inputs.amount
					? gte(nounsBids.amount, BigInt(inputs.amount.min))
					: undefined,
			),
		});

		return !!bid;
	},
	filters: {
		// TODO: Winning bid filter
		amount: createFilter({
			name: "Amount",
			options: {
				min: {
					name: "At least",
					description: "The minimum amount of ETH to bid",
					schema: z.number(),
				},
			},
		}),
	},
});
