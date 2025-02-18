import { and, eq } from "drizzle-orm";

import { privyClient } from "@/server/clients/privy";
import { sql } from "drizzle-orm";
import { db, nexus, xp } from "~/packages/db/schema";

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

	await db.transaction(async (tx) => {
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

		await tx.insert(xp).values({
			user: privyUser.id,
			order: order.admin_graphql_api_id,
			amount: xpAmount,
			timestamp: new Date(order.created_at),
		});

		await tx
			.update(nexus)
			.set({
				xp: sql`${nexus.xp} + ${xpAmount}`,
			})
			.where(eq(nexus.id, privyUser.id));
	});

	return new Response("OK", { status: 200 });
}
