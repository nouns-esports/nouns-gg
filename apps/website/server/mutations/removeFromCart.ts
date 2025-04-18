"use server";

import { onlyUser } from ".";
import { z } from "zod";
import { carts } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, eq } from "drizzle-orm";

export const removeFromCart = onlyUser
	.schema(
		z.object({
			product: z.number(),
			variant: z.number(),
			quantity: z.number(),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const existingCartItem = await db.primary.query.carts.findFirst({
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
			await db.primary.delete(carts).where(eq(carts.id, existingCartItem.id));
		} else {
			await db.primary
				.update(carts)
				.set({
					quantity: existingCartItem.quantity - parsedInput.quantity,
				})
				.where(eq(carts.id, existingCartItem.id));
		}
	});
