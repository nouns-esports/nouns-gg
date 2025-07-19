import { and, eq } from "drizzle-orm";

import { privyClient } from "@/server/clients/privy";
import { sql } from "drizzle-orm";
import { leaderboards, nexus, orders, xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

// 10 xp per $ spent (not shipping)
type OrderCreated = {
	admin_graphql_api_id: string;
	created_at: string;
	line_items: Array<{
		price_set: {
			shop_money: {
				amount: string;
				currency_code: string;
			};
		};
	}>;
	email: string;
};

export async function POST(request: Request) {
	const order: OrderCreated = await request.json();

	await db.primary.transaction(async (tx) => {
		const subTotalWithoutDiscounts = order.line_items
			.filter((item) => item.price_set.shop_money.currency_code === "USD")
			.reduce((acc, item) => acc + Number(item.price_set.shop_money.amount), 0);

		if (subTotalWithoutDiscounts <= 0) {
			throw new Error("Subtotal price without discounts is <= 0");
		}

		if (!order.email) {
			throw new Error("No email in order");
		}

		const privyUser = await privyClient.getUserByEmail(order.email);

		if (!privyUser) {
			throw new Error("User not found");
		}

		const user = await tx.query.nexus.findFirst({
			where: eq(nexus.privyId, privyUser.id),
		});

		if (!user) {
			throw new Error("User not found");
		}

		const existingOrder = await tx.query.orders.findFirst({
			where: and(
				eq(xp.user, user.id),
				eq(xp.order, order.admin_graphql_api_id),
			),
			with: {
				xp: {
					where: and(eq(xp.for, "PLACING_ORDER"), eq(xp.user, user.id)),
				},
			},
		});

		if (existingOrder) {
			throw new Error("Order already exists");
		}

		const xpAmount = Math.round(subTotalWithoutDiscounts * 10);

		const nounsgg = "98e09ea8-4c19-423c-9733-b946b6f70902";

		const [createdOrder] = await tx
			.insert(orders)
			.values({
				user: user.id,
				community: nounsgg,
				identifier: order.admin_graphql_api_id,
				platform: "shopify",
				createdAt: new Date(order.created_at),
				spend: subTotalWithoutDiscounts,
			})
			.returning();

		await tx.insert(xp).values({
			user: user.id,
			amount: xpAmount,
			timestamp: new Date(order.created_at),
			community: nounsgg,
			for: "PLACING_ORDER",
			order: createdOrder.id,
		});

		await tx
			.insert(leaderboards)
			.values({
				user: user.id,
				xp: xpAmount,
				community: nounsgg,
			})
			.onConflictDoUpdate({
				target: [leaderboards.user, leaderboards.community],
				set: {
					xp: sql`${leaderboards.xp} + ${xpAmount}`,
				},
			});
	});

	return new Response("OK", { status: 200 });
}
