import { db } from "../";
import { snapshots } from "../schema/public";

const lilnounsVotes = await db.primary.query.lilnounsVotes.findMany();

await db.primary.insert(snapshots).values(
	lilnounsVotes.map((vote) => ({
		type: "lilnouns-software",
		tag: `${vote.account}:${vote.count}`,
		user: crypto.randomUUID(),
	})),
);
