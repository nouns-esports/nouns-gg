"use server";

import { onlyUser } from ".";
import { z } from "zod";
import { shopifyClient } from "../clients/shopify";
import {
	carts,
	gold,
	leaderboards,
	nexus,
	orders,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const CREATE_DRAFT_ORDER_MUTATION = `
  mutation CreateDraftOrder($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        invoiceUrl
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_DRAFT_ORDER_QUERY = `
	query GetDraftOrder($id: ID!) {
		draftOrder(id: $id) {
			ready
		}
	}
`;

export const createDraftOrder = onlyUser
	.schema(
		z.object({
			shipping: z
				.object({
					firstName: z.string(),
					lastName: z.string(),
					address1: z.string(),
					address2: z.string().optional(),
					city: z.string(),
					province: z.string().optional(),
					country: z.string(),
					zip: z.string().optional(),
				})
				.optional(),
			goldApplied: z.number(),
			email: z.string(),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		let draftOrder:
			| {
					id: string;
					invoiceUrl: string;
					status: string;
			  }
			| undefined;

		const nounsgg = "98e09ea8-4c19-423c-9733-b946b6f70902";

		await db.primary.transaction(async (tx) => {
			if (!ctx.user.nexus) {
				throw new Error("User does not have a nexus");
			}

			// Make sure the user has enough gold before creating the draft order
			if (parsedInput.goldApplied > 0) {
				await tx
					.update(leaderboards)
					.set({
						points: sql`${leaderboards.points} - ${parsedInput.goldApplied}`,
					})
					.where(
						and(
							eq(leaderboards.user, ctx.user.id),
							eq(leaderboards.community, nounsgg),
						),
					);
			}

			const response = await shopifyClient.request(
				CREATE_DRAFT_ORDER_MUTATION,
				{
					variables: {
						input: {
							lineItems: ctx.user.nexus.carts.map((item) => ({
								variantId: item.variant.shopifyId,
								quantity: item.quantity,
							})),
							shippingAddress: parsedInput.shipping
								? {
										firstName: parsedInput.shipping.firstName,
										lastName: parsedInput.shipping.lastName,
										address1: parsedInput.shipping.address1,
										address2: parsedInput.shipping.address2 || null,
										city: parsedInput.shipping.city,
										province: parsedInput.shipping.province,
										country: parsedInput.shipping.country,
										zip: parsedInput.shipping.zip,
									}
								: undefined,
							email: parsedInput.email,
							useCustomerDefaultAddress: false,
							appliedDiscount:
								parsedInput.goldApplied > 0
									? {
											title: "Points Redemption",
											value: parsedInput.goldApplied / 100,
											valueType: "FIXED_AMOUNT",
										}
									: undefined,
						},
					},
				},
			);

			if (!response.data?.draftOrderCreate?.draftOrder) {
				console.error("Errors", response.errors);
				console.error(response.data?.draftOrderCreate?.userErrors);
				throw new Error("Error creating draft order");
			}

			draftOrder = response.data?.draftOrderCreate?.draftOrder as {
				id: string;
				invoiceUrl: string;
				status: string;
			};

			const [createdDraftOrder] = await tx
				.insert(orders)
				.values({
					identifier: draftOrder.id,
					user: ctx.user.id,
					community: nounsgg,
					platform: "shopify",
					draft: true,
				})
				.returning();

			if (parsedInput.goldApplied > 0) {
				// Save a history of the gold transaction
				await tx.insert(gold).values({
					amount: parsedInput.goldApplied,
					order: createdDraftOrder.id,
					from: ctx.user.id,
					to: null,
					community: nounsgg,
					for: "REDEMPTION_DISCOUNT",
				});
			}

			// Clear the users cart
			await tx.delete(carts).where(eq(carts.user, ctx.user.id));
		});

		if (!draftOrder) {
			throw new Error("Draft order not set");
		}

		for (let attempts = 0; attempts < 5; attempts++) {
			const getDraftOrder = await shopifyClient.request(GET_DRAFT_ORDER_QUERY, {
				variables: {
					id: draftOrder.id,
				},
			});

			if (getDraftOrder.data?.draftOrder?.ready) {
				break;
			}

			await new Promise((resolve) => setTimeout(resolve, 1000));
		}

		return draftOrder.invoiceUrl;
	});
