import { and, isNotNull } from "drizzle-orm";
import { discordClient, rest } from "../clients/discord";
import { env } from "~/env";
import { db, nexus } from "~/packages/db/schema";
import { createJob } from "../createJob";
import { Routes } from "discord.js";

const roles: {
	development: {
		ranks: Record<number, string>;
		labels: {
			nexus: string;
			explorer: string;
			challenger: string;
			champion: string;
			nouner: string;
			lilnouner: string;
		};
	};
	production: {
		ranks: Record<number, string>;
		labels: {
			nexus: string;
			explorer: string;
			challenger: string;
			champion: string;
			nouner: string;
			lilnouner: string;
		};
	};
} = {
	development: {
		ranks: {
			1: "1253532214784819240", // Explorer I
			2: "1253778440100909118", // Explorer II
			3: "1253778462511202365", // Explorer III
			4: "1292849974232485973", // Challenger I
			5: "1292849978930233355", // Challenger II
			6: "1292849981371318313", // Challenger III
			7: "1292849984428969995", // Champion I
			8: "1292849987188822036", // Champion II
			9: "1292849990086955058", // Champion III
		},
		labels: {
			nexus: "",
			explorer: "",
			challenger: "",
			champion: "",
			nouner: "",
			lilnouner: "",
		},
	},
	production: {
		ranks: {
			1: "1292850459672838144", // Explorer I
			2: "1292850515465601056", // Explorer II
			3: "1292850519181889590", // Explorer III
			4: "1292850522855833682", // Challenger I
			5: "1292850525380804629", // Challenger II
			6: "1292850528266616903", // Challenger III
			7: "1292850531479588967", // Champion I
			8: "1292850534327521300", // Champion II
			9: "1292850537292759051", // Champion III
		},
		labels: {
			nexus: "1296891293385101343",
			explorer: "1334000480766005288",
			challenger: "1334000358032150538",
			champion: "1334000168982544455",
			nouner: "1288240474305462404",
			lilnouner: "1333162119838830602",
		},
	},
};

export const refreshRoles = createJob({
	name: "Refresh Roles",
	cron: "0 * * * *", // Every hour
	execute: async () => {
		const guild = discordClient.guilds.cache.get(env.DISCORD_GUILD_ID);

		if (!guild) {
			throw new Error("Guild not found");
		}

		const [nexusUsers, guildMembers] = await Promise.all([
			db.query.nexus.findMany({
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

			const availableRoles = roles[env.NEXT_PUBLIC_ENVIRONMENT];

			// Ranked Role
			if (!user.discord.roles.includes(availableRoles.ranks[user.rank])) {
				await addRole({
					user: user.discord.id,
					role: availableRoles.ranks[user.rank],
				});
			}

			// Remove other ranks
			for (const [rank, role] of Object.entries(availableRoles.ranks)) {
				if (user.rank === Number(rank)) continue;

				if (user.discord.roles.includes(role)) {
					await removeRole({ user: user.discord.id, role });
				}
			}

			// Explorer Role
			if ([1, 2, 3].includes(user.rank)) {
				await addRole({
					user: user.discord.id,
					role: availableRoles.labels.explorer,
				});

				if (user.discord.roles.includes(availableRoles.labels.challenger)) {
					await removeRole({
						user: user.discord.id,
						role: availableRoles.labels.challenger,
					});
				}

				if (user.discord.roles.includes(availableRoles.labels.champion)) {
					await removeRole({
						user: user.discord.id,
						role: availableRoles.labels.champion,
					});
				}
			}

			// Challenger Role
			if ([4, 5, 6].includes(user.rank)) {
				await addRole({
					user: user.discord.id,
					role: availableRoles.labels.challenger,
				});

				if (user.discord.roles.includes(availableRoles.labels.explorer)) {
					await removeRole({
						user: user.discord.id,
						role: availableRoles.labels.explorer,
					});
				}

				if (user.discord.roles.includes(availableRoles.labels.champion)) {
					await removeRole({
						user: user.discord.id,
						role: availableRoles.labels.champion,
					});
				}
			}

			// Champion Role
			if ([7, 8, 9].includes(user.rank)) {
				await addRole({
					user: user.discord.id,
					role: availableRoles.labels.champion,
				});

				if (user.discord.roles.includes(availableRoles.labels.challenger)) {
					await removeRole({
						user: user.discord.id,
						role: availableRoles.labels.challenger,
					});
				}

				if (user.discord.roles.includes(availableRoles.labels.explorer)) {
					await removeRole({
						user: user.discord.id,
						role: availableRoles.labels.explorer,
					});
				}
			}

			// Nexus Role
			if (!user.discord.roles.includes(availableRoles.labels.nexus)) {
				await addRole({
					user: user.discord.id,
					role: availableRoles.labels.nexus,
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
