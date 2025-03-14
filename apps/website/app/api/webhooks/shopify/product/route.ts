import { eq } from "drizzle-orm";
import { products } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

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

export async function POST(request: Request) {
	const updatedProduct: ProductUpdated = await request.json();

	await db.primary.transaction(async (tx) => {
		const product = await tx.query.products.findFirst({
			where: eq(products.shopifyId, updatedProduct.admin_graphql_api_id),
		});

		if (!product) {
			throw new Error("Updated product not found");
		}

		await tx
			.update(products)
			.set({
				variants: product.variants.map((variant) => {
					const updatedVariant = updatedProduct.variants.find(
						(v) => v.admin_graphql_api_id === variant.shopifyId,
					);

					if (!updatedVariant) {
						return variant;
					}

					return {
						...variant,
						inventory: updatedVariant.inventory_item.tracked
							? updatedVariant.inventory_quantity
							: undefined,
						price: Number(updatedVariant.price),
					};
				}),
			})
			.where(eq(products.shopifyId, updatedProduct.admin_graphql_api_id));
	});

	return new Response("OK", { status: 200 });
}
