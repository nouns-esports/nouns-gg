import { desc, eq } from "drizzle-orm";
import { db, rankings } from "~/packages/db/schema";

const timestamps = await Promise.all(
  [
    "2024-10-08T08:03:10.895Z",
    "2024-10-09T14:01:48.016Z",
    "2024-10-10T16:03:54.594Z",
    "2024-10-11T15:25:57.027Z",
    "2024-10-12T14:38:17.660Z",
    "2024-10-13T14:40:40.478Z",
    "2024-10-14T21:06:28.374Z",
  ].map(async (timestamp) => {
    return db.query.rankings.findMany({
      where: eq(rankings.timestamp, new Date(timestamp)),
      orderBy: desc(rankings.xp),
    });
  })
);

await db.transaction(async (tx) => {
  for (let i = 0; i < timestamps.length; i++) {
    const rankingsAtTimestamp = timestamps[i];

    for (let j = 0; j < rankingsAtTimestamp.length; j++) {
      const ranking = rankingsAtTimestamp[j];

      console.log(
        "Leaderboard",
        i + 1,
        "ranking",
        `${j + 1}/${timestamps[i].length}`
      );

      await tx
        .update(rankings)
        .set({
          position: j + 1,
        })
        .where(eq(rankings.id, ranking.id));
    }
  }
});
