import { nexus, xp, snapshots } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, gte, lte, desc, eq, inArray, or } from "drizzle-orm";
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
			throw new Error("You are not authorized to take xp snapshots");
		}

		const now = new Date();

		const latestSnapshot = await db.query.snapshots.findFirst({
			where: eq(snapshots.type, "discord-call"),
			orderBy: desc(snapshots.timestamp),
		});

		if (latestSnapshot && isToday(latestSnapshot.timestamp)) {
			throw new Error("A snapshot has already been taken today");
		}

		console.log(context.room);

		const channel = await agent.plugins.discord.client.channels.fetch(
			context.room,
			{ force: true },
		);

		if (!channel) {
			throw new Error("I couldn't find that voice channel");
		}

		if (!channel.isVoiceBased()) {
			throw new Error("I can only take xp snapshots from voice channels");
		}

		const members = channel.members.map(
			(guildMember) => guildMember.user.username,
		);

		console.log(members);

		if (members.length === 0) {
			throw new Error("Theres nobody in the channel right now");
		}

		const users = await db.query.nexus.findMany({
			where: inArray(nexus.discord, members),
		});

		if (users.length === 0) {
			throw new Error(
				"I couldn't find any nouns.gg accounts associated with anyone in the contributor voice channel",
			);
		}

		// await db.transaction(async (tx) => {
		// 	for (const user of users) {
		// 		const [snapshot] = await tx
		// 			.insert(snapshots)
		// 			.values({
		// 				type: "discord-call",
		// 				user: user.id,
		// 				timestamp: now,
		// 			})
		// 			.returning({ id: snapshots.id });

		// 		const amount = 300;

		// 		await tx.insert(xp).values({
		// 			user: user.id,
		// 			amount,
		// 			timestamp: now,
		// 			snapshot: snapshot.id,
		// 		});

		// 		await tx
		// 			.update(nexus)
		// 			.set({
		// 				xp: user.xp + amount,
		// 			})
		// 			.where(eq(nexus.id, user.id));
		// 	}
		// });
	},
});
