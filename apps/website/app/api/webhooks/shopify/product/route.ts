import { eq } from "drizzle-orm";
import { db, products } from "~/packages/db/schema";

type ProductUpdated = {
	admin_graphql_api_id: string;
	variants: Array<{
		admin_graphql_api_id: string;
		inventory_quantity: number;
		price: string;
	}>;
};

export async function POST(request: Request) {
	const updatedProduct: ProductUpdated = await request.json();

	await db.transaction(async (tx) => {
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
						inventory: updatedVariant.inventory_quantity,
						price: Number(updatedVariant.price),
					};
				}),
			})
			.where(eq(products.shopifyId, updatedProduct.admin_graphql_api_id));
	});
}
