import { db } from "~/packages/db";
import { createAction } from "../createAction";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { orders } from "~/packages/db/schema/public";

export const purchaseItem = createAction({
	name: "Purchase Item",
	schema: z.object({}),
	check: async ({ user, community }) => {
		const order = await db.primary.query.orders.findFirst({
			where: and(eq(orders.user, user.id), eq(orders.community, community.id)),
		});

		return !!order;
	},
});
