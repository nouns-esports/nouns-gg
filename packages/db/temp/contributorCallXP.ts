import { and, desc, eq, sql } from "drizzle-orm";
import {
	accounts,
	escrows,
	leaderboards,
	nexus,
	snapshots,
	xp,
} from "../schema/public";
import { db } from "..";

const attendees = [
	"103629588353007616",
	"405120207300853761",
	"1344139561386639430",
	"232343860121042945",
	"960536210625929276",
	"236907172808753152",
	"214245556757725185",
	"124347112182775809",
	"153701297214849024",
	"720674343960707132",
	"179396250318143488",
	"835989319701233704",
	"688862120468938816",
	"135377635168616448",
	"174640628456620032",
	"135215986407243776",
	"95704393151680512",
	"197786946527952906",
	"900067308150587442",
	"754779772340535428",
	"114038641071882248",
	"1042518382173499412",
	"146467134103355392",
	"342006631078428672",
	"938952067656069151",
	"708894360560730163",
	"271087536258940930",
];

const now = new Date();
const nounsgg = "98e09ea8-4c19-423c-9733-b946b6f70902";

await db.primary.transaction(async (tx) => {
	let count = 0;
	for (const user of attendees) {
		count++;
		console.log("Processing user", count, attendees.length);
		let account = await tx.query.accounts.findFirst({
			where: and(
				eq(accounts.identifier, user),
				eq(accounts.platform, "discord"),
			),
			with: { user: true },
		});

		if (!account) {
			await tx.insert(accounts).values({
				identifier: user,
				platform: "discord",
			});

			account = await tx.query.accounts.findFirst({
				where: and(
					eq(accounts.identifier, user),
					eq(accounts.platform, "discord"),
				),
				with: { user: true },
			});

			if (!account) {
				console.error("Account not found after insert", user);
				continue;
			}
		}

		const amount = 500;

		if (account.user) {
			await tx.insert(xp).values({
				user: account.user.id,
				amount,
				timestamp: now,
				community: nounsgg,
			});

			await tx
				.insert(leaderboards)
				.values({
					user: account.user.id,
					xp: amount,
					community: nounsgg,
				})
				.onConflictDoUpdate({
					target: [leaderboards.user, leaderboards.community],
					set: {
						xp: sql`${leaderboards.xp} + ${amount}`,
					},
				});
		} else {
			await tx
				.insert(escrows)
				.values({
					community: nounsgg,
					heir: account.id,
					xp: amount,
				})
				.onConflictDoUpdate({
					target: [escrows.community, escrows.heir],
					set: {
						xp: sql`${escrows.xp} + ${amount}`,
					},
				});
		}
	}
});
