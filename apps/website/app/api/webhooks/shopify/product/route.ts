import { eq } from "drizzle-orm";
import { products, productVariants } from "~/packages/db/schema/public";
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
			for (const variant of product.variants.nodes) {
				const existingVariant = await tx.query.productVariants.findFirst({
					where: eq(productVariants.shopifyId, variant.id),
				});

				if (!existingVariant) {
					continue;
				}

				await tx
					.update(productVariants)
					.set({
						inventory: variant.inventoryItem.tracked
							? variant.inventoryQuantity
							: undefined,
						price: Number(variant.price),
					})
					.where(eq(productVariants.shopifyId, variant.id));
			}
		}
	});

	return new Response("OK", { status: 200 });
}
