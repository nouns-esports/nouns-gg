import { and, eq } from "drizzle-orm";

import { privyClient } from "@/server/clients/privy";
import { sql } from "drizzle-orm";
import { leaderboards, nexus, xp } from "~/packages/db/schema/public";
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

		const existingXP = await tx.query.xp.findFirst({
			where: and(
				eq(xp.user, privyUser.id),
				eq(xp.order, order.admin_graphql_api_id),
			),
		});

		if (existingXP) {
			throw new Error("XP already distributed for this order");
		}

		const xpAmount = Math.round(subTotalWithoutDiscounts * 10);

		const nounsgg = "98e09ea8-4c19-423c-9733-b946b6f70902"

		await tx.insert(xp).values({
			user: privyUser.id,
			order: order.admin_graphql_api_id,
			amount: xpAmount > 500 ? 500 : xpAmount,
			timestamp: new Date(order.created_at),
			community: nounsgg,
		});

		await tx
			.insert(leaderboards)
			.values({
				user: privyUser.id,
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
