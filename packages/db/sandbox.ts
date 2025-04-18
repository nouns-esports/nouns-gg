import { db } from ".";
import { productVariants } from "./schema/public";

const products = await db.primary.query.products.findMany();

await db.primary.transaction(async (tx) => {
	for (const product of products) {
		for (let i = 0; i < product.variants.length; i++) {
			const variant = product.variants[i];

			await tx.insert(productVariants).values({
				product: product.id,
				shopifyId: variant.shopifyId,
				images: i === 0 ? product.images : [],
				price: variant.price,
				inventory: variant.inventory,
				color: variant.color,
				size: variant.size,
			});
		}
	}
});
