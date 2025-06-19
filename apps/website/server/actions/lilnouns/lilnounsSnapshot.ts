import { z } from "zod";
import { createAction } from "../createAction";
import { createFilter } from "../createFilter";
import { db } from "~/packages/db";
import { and, ilike } from "drizzle-orm";
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

        for (const wallet of user.wallets) {
            const snapshot = await db.pgpool.query.snapshots.findFirst({
                where: and(
                    eq(snapshots.type, "lilnouns-open-round"),
                    ilike(snapshots.tag, `${wallet.address.toLowerCase()}:%`)
                ),
            });

            if (snapshot) {
                return true;
            }
        }

        return false;
    },
    filters: {
    },
});
