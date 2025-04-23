import {
	nexus,
	xp,
	snapshots,
	leaderboards,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, gte, lte, desc, eq, inArray, or, sql } from "drizzle-orm";
import { agent } from "..";
import { isToday } from "date-fns";

agent.addTool({
	description:
		"Takes a snapshot and distributes xp to attendees of a weekly contributor voice call",
	providers: ["discord"],
	execute: async ({ parameters, context }) => {
		if (
			![
				"samscolari",
				"sasquatch",
				"peterpandam",
				"ohantheman",
				"patyiutazza",
			].includes(context.author)
		) {
			console.log("Not authorized");
			throw new Error("You are not authorized to take xp snapshots");
		}

		const now = new Date();

		const latestSnapshot = await db.primary.query.snapshots.findFirst({
			where: eq(snapshots.type, "discord-call"),
			orderBy: desc(snapshots.timestamp),
		});

		if (latestSnapshot && isToday(latestSnapshot.timestamp)) {
			console.log("A snapshot has already been taken today");
			throw new Error("A snapshot has already been taken today");
		}

		console.log(context.room);

		const channel = await agent.plugins.discord.client.channels.fetch(
			context.room,
			{ force: true },
		);

		if (!channel) {
			console.log("No channel found");
			throw new Error("I couldn't find that voice channel");
		}

		if (!channel.isVoiceBased()) {
			console.log("Not a voice channel");
			throw new Error("I can only take xp snapshots from voice channels");
		}

		const members = channel.members.map(
			(guildMember) => guildMember.user.username,
		);

		console.log(members);

		if (members.length === 0) {
			console.log("No members found");
			throw new Error("Theres nobody in the channel right now");
		}

		const users = await db.pgpool.query.nexus.findMany({
			where: inArray(nexus.discord, members),
		});

		if (users.length === 0) {
			console.log("No users found");
			throw new Error(
				"I couldn't find any nouns.gg accounts associated with anyone in the contributor voice channel",
			);
		}

		await db.primary.transaction(async (tx) => {
			for (const user of users) {
				const [snapshot] = await tx
					.insert(snapshots)
					.values({
						type: "discord-call",
						user: user.id,
						timestamp: now,
					})
					.returning({ id: snapshots.id });

				const amount = 500;

				await tx.insert(xp).values({
					user: user.id,
					amount,
					timestamp: now,
					snapshot: snapshot.id,
					community: 7,
				});

				await tx
					.insert(leaderboards)
					.values({
						user: user.id,
						xp: amount,
						community: 7,
					})
					.onConflictDoUpdate({
						target: [leaderboards.user, leaderboards.community],
						set: {
							xp: sql`${leaderboards.xp} + ${amount}`,
						},
					});

				await tx
					.update(nexus)
					.set({
						xp: user.xp + amount,
					})
					.where(eq(nexus.id, user.id));
			}
		});
	},
});
