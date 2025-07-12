import { embed } from "ai";
import { openai } from "~/packages/agent/models";
import { db } from "..";
import { eq, isNull } from "drizzle-orm";
import { products } from "../schema/public";
import { tiptapToText } from "~/packages/utils/tiptapToText";

const allProducts = await db.primary.query.products.findMany({
	where: isNull(products.embedding),
	with: {
		community: true,
		event: true,
		collection: true,
		variants: true,
	},
});

let count = 0;
for (const product of allProducts) {
	count++;
	const text = [
		`Product Name: ${product.name}`,
		`Product Handle: ${product.handle}`,
		product.description
			? `Product Description: ${tiptapToText(product.description)}`
			: null,
		product.community?.name
			? `Product Community Name: ${product.community.name}`
			: null,
		product.community?.handle
			? `Product Community Handle: ${product.community.handle}`
			: null,
		product.event?.name ? `Product Event Name: ${product.event.name}` : null,
		product.event?.handle
			? `Product Event Handle: ${product.event.handle}`
			: null,
		`Product Is Digital: ${product.requiresShipping}`,
		product.collection?.name
			? `Product Collection Name: ${product.collection.name}`
			: null,
		product.collection?.handle
			? `Product Collection Handle: ${product.collection.handle}`
			: null,
		product.variants.length > 1
			? `Product Variants: 
${product.variants
	.map(
		(variant, index) =>
			`${index + 1}. ${variant.color ? `Variant Color: ${variant.color.name} - ${variant.color.hex},` : ""} ${variant.size ? `Variant Size: ${variant.size}` : ""}`,
	)
	.join("\n")}`
			: null,
	]
		.filter(Boolean)
		.join("\n");

	// console.log(text);
	// console.log("--------------------------------");

	console.log("Embedding Product", count, allProducts.length);

	const embedding = await embed({
		model: openai.embedding("text-embedding-3-small"),
		value: text,
	});

	await db.primary
		.update(products)
		.set({
			embedding: embedding.embedding,
		})
		.where(eq(products.id, product.id));
}
