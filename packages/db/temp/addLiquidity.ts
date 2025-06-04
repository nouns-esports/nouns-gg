import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { outcomes, predictions } from "../schema/public";

const id = 106;
const amount = 10_000;

const prediction = await db.primary.query.predictions.findFirst({
    where: eq(predictions.id, id),
    with: {
        outcomes: true,
    }
});

if (!prediction) {
    throw new Error("Prediction not found");
}


await db.primary.transaction(async (tx) => {
    await tx.update(predictions).set({
        pool: sql`CAST(${prediction.pool} AS numeric) + CAST(${amount} AS numeric)`,
    }).where(eq(predictions.id, prediction.id));

    for (const outcome of prediction.outcomes) {
        await tx.update(outcomes).set({
            pool: sql`CAST(${outcome.pool} AS numeric) + CAST(${amount / prediction.outcomes.length} AS numeric)`,
        }).where(eq(outcomes.id, outcome.id));
    }
});