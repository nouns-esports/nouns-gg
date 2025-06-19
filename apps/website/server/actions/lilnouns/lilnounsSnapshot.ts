import { z } from "zod";
import { createAction } from "../createAction";
import { createFilter } from "../createFilter";
import { db } from "~/packages/db";
import { and } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { snapshots } from "~/packages/db/schema/public";

export const lilnounsSnapshot = createAction({
    image: "",
    name: "Lilnouns Snapshot",
    category: "lilnouns",
    generateDescription: async (inputs) => {
        "use server";

        return [{ text: "LilNouns voter snapshot " }, { highlight: true, text: "6/18/2025" }]
    },
    check: async ({ user, inputs }) => {
        "use server";

        const lilnounVotes =
            user.wallets.length > 0
                ? (Number(
                    (
                        await db.pgpool.query.snapshots.findFirst({
                            where: and(
                                eq(snapshots.type, "lilnouns-open-round"),
                                sql`${snapshots.tag} LIKE ANY(ARRAY[${sql.join(
                                    user.wallets.map(
                                        (w) => sql`${w.address.toLowerCase()} || ':%'`,
                                    ),
                                    ", ",
                                )}])`,
                            ),
                        })
                    )?.tag?.split(":")[1],
                ) ?? 0)
                : 0;


        return lilnounVotes > 0;
    },
    filters: {
    },
});
