import { eq } from "drizzle-orm";
import { products } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { shopifyClient } from "@/server/clients/shopify";

type ProductUpdated = {
	admin_graphql_api_id: string;
	variants: Array<{
		admin_graphql_api_id: string;
		inventory_quantity: number;
		price: string;
		inventory_item: {
			tracked: boolean;
		};
	}>;
};

type Product = {
	id: string;
	variants: {
		nodes: Array<{
			id: string;
			inventoryQuantity: number;
			price: string;
			inventoryItem: {
				tracked: boolean;
			};
		}>;
	};
};

export async function POST(request: Request) {
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
							inventoryItem {
								tracked
							}
						}
					}
				}
			}
		}`,
		)
	).data?.products?.nodes as Product[];

	await db.primary.transaction(async (tx) => {
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
							inventory: updatedVariant.inventoryItem.tracked
								? updatedVariant.inventoryQuantity
								: undefined,
							price: Number(updatedVariant.price),
						};
					}),
				})
				.where(eq(products.shopifyId, product.id));
		}
	});

	return new Response("OK", { status: 200 });
}
