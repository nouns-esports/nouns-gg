"use server";

import { and, eq } from "drizzle-orm";
import { carts, collections } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { unstable_cache as cache } from "next/cache";
import { products } from "~/packages/db/schema/public";
import { shopifyClient } from "../clients/shopify";

export async function getProducts(input: {
	collection?: string;
	event?: number;
}) {
	const collection = input.collection
		? await db.pgpool.query.collections.findFirst({
				where: eq(collections.handle, input.collection),
			})
		: null;

	return db.pgpool.query.products.findMany({
		where: and(
			collection ? eq(products.collection, collection.id) : undefined,
			input.event ? eq(products.event, input.event) : undefined,
		),
	});
}

export async function getCollections() {
	return db.pgpool.query.collections.findMany();
}

export async function getProduct(input: { handle: string }) {
	return db.pgpool.query.products.findFirst({
		where: eq(products.handle, input.handle),
	});
}

export async function getCollection(input: { handle: string }) {
	return db.pgpool.query.collections.findFirst({
		where: eq(collections.handle, input.handle),
		with: {
			products: true,
		},
	});
}

export async function checkCart(input: { user: string }) {
	const cart = await db.pgpool.query.carts.findMany({
		where: eq(carts.user, input.user),
		with: {
			product: true,
		},
	});

	const variants = cart.map((item) => item.variant);

	for (const item of cart) {
		if (!item.product.active) {
			return false;
		}
	}

	try {
		const response = await shopifyClient.request(
			`query($variantIds: [ID!]!) {
			nodes(ids: $variantIds) {
				... on ProductVariant {
					id
					price
					inventoryQuantity
					inventoryItem {
						tracked
					}
				}
			}
		}`,
			{
				variables: {
					variantIds: variants,
				},
			},
		);

		const refreshedVariants =
			(response.data?.nodes as Array<{
				id: string;
				price: string;
				inventoryQuantity: number;
				inventoryItem: {
					tracked: boolean;
				};
			}>) ?? [];

		await db.primary.transaction(async (tx) => {
			for (const variant of refreshedVariants) {
				const product = cart.find(
					(item) => item.variant === variant.id,
				)?.product;

				if (!product) continue;

				const existingVariant = product.variants.find(
					(v) => v.shopifyId === variant.id,
				);

				if (!existingVariant) continue;

				if (existingVariant.inventory === variant.inventoryQuantity) continue;
				if (existingVariant.price.toFixed(2) !== variant.price) continue;

				await tx
					.update(products)
					.set({
						variants: product.variants.map((v) => {
							if (v.shopifyId === variant.id) {
								return {
									...v,
									inventory: variant.inventoryItem.tracked
										? variant.inventoryQuantity
										: undefined,
									price: Number(variant.price),
								};
							}

							return v;
						}),
					})
					.where(eq(products.id, product.id));
			}
		});

		for (const variant of refreshedVariants) {
			const item = cart.find((item) => item.variant === variant.id);

			if (!item) continue;

			if (
				variant.inventoryItem.tracked &&
				variant.inventoryQuantity < item.quantity
			) {
				return false;
			}
		}
	} catch (e) {
		console.error(e);
	}

	return true;
}

export async function estimateOrderCost(input: {
	items: Array<{ variant: string; quantity: number }>;
	shipping: {
		address1: string;
		address2?: string;
		city: string;
		province: string;
		country: string;
		zip?: string;
	};
}) {
	const response = await shopifyClient.request(
		`mutation($input: DraftOrderInput!) {
			draftOrderCalculate(input: $input) {
				calculatedDraftOrder {
					totalTaxSet {
						shopMoney {
							amount
							currencyCode
						}
					}
					availableShippingRates {
						price {
							amount
						}
					}
				}
			}
		}`,
		{
			variables: {
				input: {
					shippingAddress: {
						address1: input.shipping.address1,
						address2: input.shipping.address2,
						city: input.shipping.city,
						provinceCode: input.shipping.province,
						countryCode: input.shipping.country,
						zip: input.shipping.zip,
					},
					lineItems: input.items.map((item) => ({
						variantId: item.variant,
						quantity: item.quantity,
					})),
				},
			},
		},
	);

	if (response.data?.draftOrderCalculate?.calculatedDraftOrder) {
		return {
			tax: Number(
				response.data?.draftOrderCalculate?.calculatedDraftOrder?.totalTaxSet
					?.shopMoney?.amount ?? 0,
			),
			shipping: Number(
				response.data?.draftOrderCalculate?.calculatedDraftOrder
					?.availableShippingRates?.[0]?.price?.amount ?? 0,
			),
		};
	}

	return {
		tax: 0,
		shipping: 0,
	};
}
