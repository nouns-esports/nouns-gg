import { z } from "zod";
import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { and, eq } from "drizzle-orm";
import { follows, profiles } from "~/packages/db/schema/farcaster";

export const followAccount = createAction({
	schema: z.object({
		account: z.number().describe("The account to follow"),
	}),
	create: async (input) => {
		const account = await db.primary.query.profiles.findFirst({
			where: eq(profiles.fid, input.account),
		});

		if (!account) {
			throw new Error("Account not found");
		}

		return {
			description: (
				<p>
					Follow <span className="text-red">@{account.displayName}</span>
				</p>
			),
			url: `https://warpcast.com/${account.username}`,
			check: async (user) => {
				if (!user.farcaster) return false;

				const hasFollowed = await db.primary.query.follows.findFirst({
					where: and(
						eq(follows.fid, user.farcaster.fid),
						eq(follows.targetFid, account.fid),
					),
				});

				return !!hasFollowed;
			},
		};
	},
});
