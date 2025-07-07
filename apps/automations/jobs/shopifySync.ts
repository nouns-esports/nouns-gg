import { eq } from "drizzle-orm";
import {
	nexus,
	orders,
	products,
	productVariants,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { createJob } from "../createJob";
import { shopifyClient } from "../clients/shopify";
import { privyClient } from "../clients/privy";

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

type Order = {
	id: string;
	email: string | null;
	createdAt: string;
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

		const syncOrders = (
			await shopifyClient.request(
				`query {
				orders(first: 100, sortKey: CREATED_AT, reverse: true) {
					nodes {
						id
						email
						createdAt
					}
				}
			}`,
			)
		).data?.orders?.nodes as Order[];

		await db.primary.transaction(async (tx) => {
			for (const order of syncOrders) {
				if (!order.email) {
					continue;
				}

				await new Promise((resolve) => setTimeout(resolve, 500));

				const privyUser = await privyClient.getUserByEmail(order.email);

				if (!privyUser) {
					continue;
				}

				const user = await tx.query.nexus.findFirst({
					where: eq(nexus.privyId, privyUser.id),
				});

				if (!user) {
					continue;
				}

				const nounsgg = "98e09ea8-4c19-423c-9733-b946b6f70902";

				await tx
					.insert(orders)
					.values({
						platform: "shopify",
						identifier: order.id,
						user: user.id,
						community: nounsgg,
						createdAt: new Date(order.createdAt),
					})
					.onConflictDoNothing();
			}
		});
	},
});
