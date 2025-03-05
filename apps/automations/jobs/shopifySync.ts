import { eq } from "drizzle-orm";
import { products } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { createJob } from "../createJob";
import { shopifyClient } from "../clients/shopify";

type Product = {
	id: string;
	variants: {
		nodes: Array<{
			id: string;
			inventory_quantity: number;
			price: {
				amount: string;
			};
		}>;
	};
};

export const shopifySync = createJob({
	name: "Shopify Sync",
	cron: "0 * * * *", // Every hour
	execute: async () => {
		const syncProducts = (
			await shopifyClient.request(
				`query {
				products(first: 250) {
					nodes {
						id
						variants(first: 100) {
							nodes {
								id
								price
								inventoryQuantity
							}
						}
					}
				}
			}`,
			)
		).data?.products?.nodes as Product[];

		await db.transaction(async (tx) => {
			for (const product of syncProducts) {
				const existingProduct = await tx.query.products.findFirst({
					where: eq(products.shopifyId, product.id),
				});

				if (!existingProduct) {
					continue;
				}

				await tx
					.update(products)
					.set({
						variants: existingProduct.variants.map((variant) => {
							const updatedVariant = product.variants.nodes.find(
								(v) => v.id === variant.shopifyId,
							);

							if (!updatedVariant) {
								return variant;
							}

							return {
								...variant,
								inventory: updatedVariant.inventory_quantity,
								price: Number(updatedVariant.price.amount),
							};
						}),
					})
					.where(eq(products.id, product.id));
			}
		});
	},
});
