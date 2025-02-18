import { and, eq } from "drizzle-orm";

import { privyClient } from "@/server/clients/privy";
import { sql } from "drizzle-orm";
import { db, nexus, xp } from "~/packages/db/schema";

// 10 xp per $ spent (not shipping)
type OrderCreated = {
	admin_graphql_api_id: string;
	created_at: string;
	current_subtotal_price_set: {
		shop_money: {
			amount: string;
			currency_code: string;
		};
	};
	email: string;
};

export async function POST(request: Request) {
	const order: OrderCreated = await request.json();

	await db.transaction(async (tx) => {
		if (Number(order.current_subtotal_price_set.shop_money.amount) <= 0) {
			return;
		}

		if (!order.email) {
			throw new Error("No email in order");
		}

		if (order.current_subtotal_price_set.shop_money.currency_code !== "USD") {
			throw new Error("Currency must be USD");
		}

		const privyUser = await privyClient.getUserByEmail(order.email);

		if (!privyUser) {
			throw new Error("User not found");
		}

		const xpAmount =
			Number(order.current_subtotal_price_set.shop_money.amount) * 10;

		const existingXP = await tx.query.xp.findFirst({
			where: and(
				eq(xp.user, privyUser.id),
				eq(xp.order, order.admin_graphql_api_id),
			),
		});

		if (existingXP) {
			await tx
				.update(xp)
				.set({
					amount: sql`${xp.amount} + ${xpAmount}`,
				})
				.where(eq(xp.id, existingXP.id));
		}

		await tx
			.update(nexus)
			.set({
				xp: sql`${nexus.xp} + ${xpAmount}`,
			})
			.where(eq(nexus.id, privyUser.id));
	});
}
