// import { and, eq, sql } from "drizzle-orm";
// import { db } from "..";
// import { gold, leaderboards, nexus, predictions, xp } from "../schema/public";

// const id = 104;

// const prediction = await db.primary.query.predictions.findFirst({
//     where: eq(predictions.id, id),
//     with: {
//         earnedXP: true,
//         gold: true,
//     }
// })


// await db.primary.transaction(async (tx) => {
//     if (!prediction) {
//         throw new Error("Preidction not found")
//     }

//     let xpCount = 0;
//     for (const record of prediction.earnedXP) {
//         xpCount++;
//         console.log("XP:", xpCount, prediction.earnedXP.length)
//         await tx.update(nexus).set({
//             xp: sql`${nexus.xp} - ${record.amount}`
//         }).where(eq(nexus.id, record.user))

//         await tx.update(leaderboards).set({
//             xp: sql`${leaderboards.xp} - ${record.amount}`
//         }).where(and(eq(leaderboards.user, record.user), eq(leaderboards.community, record.community)))

//         await tx.delete(xp).where(eq(xp.id, record.id))
//     }

//     let goldCount = 0;
//     for (const record of prediction.gold) {
//         goldCount++;
//         console.log("Gold:", goldCount, prediction.gold.length)

//         if (!record.to) { throw new Error("Record should have a to") }

//         await tx.update(nexus).set({
//             gold: sql`${nexus.gold} - ${record.amount}`
//         }).where(eq(nexus.id, record.to))


//         await tx.delete(gold).where(eq(gold.id, record.id))
//     }
// })

