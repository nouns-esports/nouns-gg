import { desc, eq, sql } from "drizzle-orm";
import { leaderboards, nexus, snapshots, xp } from "../schema/public";
import { db } from "..";

const attendees = [
	"did:privy:cmah6w9ss00orl30mlql0deqt",
	"did:privy:cly8tor6x098910tpl4ng4n6o",
	"did:privy:clyvzz0v505x7nldclj3xcnqw",
	"did:privy:cm4e7gpth058pw1t6zyw6o610",
	"did:privy:clzhsduen023t91vegvl7o5dj",
	"did:privy:cm2y3rid20aq713wpavh3azio",
	"did:privy:clzhiy9gd00bn12g9yax2114c",
	"did:privy:clyqb0g630dlrepj83lquymjp",
	"did:privy:clx9g6yp500s5m4rmm11th7kt",
	"did:privy:cly54ecit00nvipx51of0u91i",
	"did:privy:clz28rcfn02wqjrehsj1ck0ws",
	"did:privy:cm4wmuo0b02fb10zshun8k1wh",
	"did:privy:clx9goa170bm3wjgyx8ktxxor",
	"did:privy:clziwqu440dk8xx4bgoa6b0g2",
	"did:privy:clzw6alkf074lg18iz5fy80ep",
	"did:privy:clx9ef4zd030211agumsnuh0p",
	"did:privy:cm6gzzbsq0243gwo2vrj9celh",
];

const now = new Date();
const nounsgg = "98e09ea8-4c19-423c-9733-b946b6f70902"

await db.primary.transaction(async (tx) => {
	for (const user of attendees) {
		const [snapshot] = await tx
			.insert(snapshots)
			.values({
				type: "discord-call",
				user,
				timestamp: now,
			})
			.returning({ id: snapshots.id });

		const amount = 500;

		await tx.insert(xp).values({
			user,
			amount,
			timestamp: now,
			snapshot: snapshot.id,
			community: nounsgg,
		});

		await tx
			.insert(leaderboards)
			.values({
				user,
				xp: amount,
				community: nounsgg,
			})
			.onConflictDoUpdate({
				target: [leaderboards.user, leaderboards.community],
				set: {
					xp: sql`${leaderboards.xp} + ${amount}`,
				},
			});
	}
});
