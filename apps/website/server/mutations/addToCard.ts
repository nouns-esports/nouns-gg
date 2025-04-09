"use server";

import { onlyUser } from ".";
import { z } from "zod";
import { carts, products } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, eq } from "drizzle-orm";

export const addToCart = onlyUser
	.schema(
		z.object({
			product: z.number(),
			variant: z.string(),
			quantity: z.number(),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const product = await db.primary.query.products.findFirst({
			where: eq(products.id, parsedInput.product),
		});

		if (!product) {
			throw new Error("Product not found");
		}

		if (!product.active) {
			throw new Error("Product is not active");
		}

		const existingCartItem = await db.primary.query.carts.findFirst({
			where: and(
				eq(carts.user, ctx.user.id),
				eq(carts.product, parsedInput.product),
				eq(carts.variant, parsedInput.variant),
			),
		});

		if (existingCartItem) {
			await db.primary
				.update(carts)
				.set({
					quantity: existingCartItem.quantity + parsedInput.quantity,
				})
				.where(eq(carts.id, existingCartItem.id));
		} else {
			await db.primary.insert(carts).values({
				user: ctx.user.id,
				product: parsedInput.product,
				variant: parsedInput.variant,
				quantity: parsedInput.quantity,
			});
		}
	});
