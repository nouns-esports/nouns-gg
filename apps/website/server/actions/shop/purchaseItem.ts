import { z } from "zod";
import { createAction } from "../createAction";
import { createFilter } from "../createFilter";
import {
	communities,
	events,
	orders,
	proposals,
	rounds,
	votes,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, eq } from "drizzle-orm";

export const purchaseItem = createAction({
	image: "",
	name: "Purchase Item",
	category: "shop",
	generateDescription: async (inputs) => {
		"use server";

		return [];
	},
	check: async ({ user, inputs }) => {
		"use server";

		const nounsgg = "98e09ea8-4c19-423c-9733-b946b6f70902";

		const order = await db.primary.query.orders.findFirst({
			where: and(eq(orders.user, user.id), eq(orders.community, nounsgg)),
		});

		return !!order;
	},
	filters: {},
});
