import { and, isNotNull } from "drizzle-orm";
import { discordClient, rest } from "../clients/discord";
import { env } from "~/env";
import { nexus } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { createJob } from "../createJob";
import { Routes } from "discord.js";

const roles = {
	verified: "1296891293385101343",
	lilnouner: "1333162119838830602",
	nouner: "1288240474305462404",
} as const;

export const refreshRoles = createJob({
	name: "Refresh Roles",
	cron: "0 * * * *", // Every hour
	execute: async () => {
		const guild = discordClient.guilds.cache.get(env.DISCORD_GUILD_ID);

		if (!guild) {
			throw new Error("Guild not found");
		}

		const [nexusUsers, guildMembers] = await Promise.all([
			db.primary.query.nexus.findMany({
				where: and(isNotNull(nexus.rank), isNotNull(nexus.discord)),
			}),
			guild.members.fetch(),
		]);

		const users = nexusUsers.map((user) => {
			const guildMember = guildMembers.find(
				(member) => member.user.username === user.discord,
			);

			if (!guildMember) return;
			if (!user.rank) return;

			return {
				id: user.id,
				rank: user.rank,
				discord: {
					id: guildMember.user.id,
					roles: guildMember.roles.cache.map((role) => role.id) ?? [],
				},
			};
		});

		for (const user of users) {
			if (!user) continue;

			// Nexus Role
			if (!user.discord.roles.includes(roles.verified)) {
				await addRole({
					user: user.discord.id,
					role: roles.verified,
				});
			}
		}
	},
});

export async function addRole(input: { user: string; role: string }) {
	return rest.put(
		Routes.guildMemberRole(env.DISCORD_GUILD_ID, input.user, input.role),
	);
}

export async function removeRole(input: { user: string; role: string }) {
	return rest.delete(
		Routes.guildMemberRole(env.DISCORD_GUILD_ID, input.user, input.role),
	);
}
