"use server";

import { onlyUser } from ".";
import { z } from "zod";
import { carts, db } from "~/packages/db/schema/public";
import { and, eq } from "drizzle-orm";

export const removeFromCart = onlyUser
	.schema(
		z.object({
			product: z.string(),
			variant: z.string(),
			quantity: z.number(),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const existingCartItem = await db.query.carts.findFirst({
			where: and(
				eq(carts.user, ctx.user.id),
				eq(carts.product, parsedInput.product),
				eq(carts.variant, parsedInput.variant),
			),
		});

		if (!existingCartItem) {
			throw new Error("Item not in cart");
		}

		if (existingCartItem.quantity - parsedInput.quantity < 1) {
			await db.delete(carts).where(eq(carts.id, existingCartItem.id));
		} else {
			await db
				.update(carts)
				.set({
					quantity: existingCartItem.quantity - parsedInput.quantity,
				})
				.where(eq(carts.id, existingCartItem.id));
		}
	});
