"use server";

import { env } from "~/env";
import { onlyUser } from ".";
import { nexus, ranks } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, asc } from "drizzle-orm";
import checkDiscordAccountAge from "@/utils/checkDiscordAccountAge";
import { revalidatePath } from "next/cache";

export const placeRank = onlyUser.action(async ({ ctx }) => {
	if (ctx.user.nexus?.rank) {
		throw new Error("You are already ranked");
	}

	if (!ctx.user.discord?.subject && !ctx.user.farcaster?.fid) {
		throw new Error("You must connect a Discord or Farcaster account first");
	}

	if (ctx.user.discord?.subject) {
		if (!checkDiscordAccountAge(ctx.user.discord.subject)) {
			throw new Error("Your Discord account is not old enough");
		}

		const response = await fetch(
			`https://discord.com/api/guilds/${env.DISCORD_GUILD_ID}/members/${ctx.user.discord.subject}`,
			{
				headers: {
					Authorization: `Bot ${env.DISCORD_TOKEN}`,
				},
			},
		);

		if (!response.ok) {
			throw new Error("User not in server");
		}
	}

	const lowestRank = await db.primary.query.ranks.findFirst({
		orderBy: asc(ranks.place),
	});

	if (!lowestRank) {
		throw new Error("No ranks found");
	}

	await db.primary
		.update(nexus)
		.set({ rank: lowestRank.id })
		.where(eq(nexus.id, ctx.user.id));

	if (ctx.user.farcaster?.username) {
		revalidatePath(`/users/${ctx.user.farcaster.username}`);
	} else revalidatePath(`/users/${ctx.user.id}`);
});
