import { isNull } from "drizzle-orm";
import { db } from ".";
import { proposals, questCompletions, votes, xp } from "./schema/public";

await db.primary.transaction(async (tx) => {
    await tx.update(votes).set({
        user: "40421f6a-b895-4d49-bc26-00c04184777a"
    }).where(isNull(votes.user))
})