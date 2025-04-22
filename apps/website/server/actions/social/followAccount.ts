import { z } from "zod";
import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { and, eq } from "drizzle-orm";
import { follows, profiles } from "~/packages/db/schema/farcaster";

export const followAccount = createAction({
	image: "",
	name: "Follow Account",
	category: "social",
	generateDescription: async (inputs) => {
		"use server";

		const account = await db.primary.query.profiles.findFirst({
			where: eq(profiles.fid, inputs.account.fid),
		});

		if (!account) throw new Error("Account not found");
		if (!account.username) throw new Error("Account has no username");

		return [
			{ text: "Follow" },
			{
				text: `@${account.username}`,
				href: `/users/${account.username}`,
			},
		];
	},
	check: async ({ inputs, user }) => {
		"use server";

		if (!user.farcaster) return false;

		const hasFollowed = await db.primary.query.follows.findFirst({
			where: and(
				eq(follows.fid, user.farcaster.fid),
				eq(follows.targetFid, inputs.account.fid),
			),
		});

		return !!hasFollowed;
	},
	filters: {
		account: {
			required: true,
			options: {
				fid: {
					name: "Farcaster ID",
					description: "The Farcaster ID of the account to follow",
					schema: z.number(),
				},
			},
			name: "Account",
		},
	},
});
