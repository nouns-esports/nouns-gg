import { shopifyClient } from "~/apps/website/server/clients/shopify";
import { db } from "../";
import { products, productVariants } from "../schema/public";
import { PinataSDK } from "pinata";
import { env } from "~/env";

const importProducts = [
	10015543656749, 10015514100013, 10015508594989, 10015500992813,
	10015022186797, 10015016124717, 10015554666797, 10015590351149,
];

const pinata = new PinataSDK({
	pinataJwt: env.PINATA_JWT,
	pinataGateway: "ipfs.nouns.gg",
});

const response = await shopifyClient.request(
	`query($productIds: [ID!]!) {
		nodes(ids: $productIds) {
			... on Product {
				variants(first: 100) {
					nodes {
						id
						title
						image {
							url
						}
						price
						inventoryQuantity
					}
				}
				title
				handle
				id
			}
		}
	}`,
	{
		variables: {
			productIds: importProducts.map((id) => `gid://shopify/Product/${id}`),
		},
	},
);

const shopifyProducts = response.data;

if (!shopifyProducts) {
	throw new Error("No products found");
}

await db.primary.transaction(async (tx) => {
	for (const product of shopifyProducts.nodes) {
		const [{ id }] = await tx
			.insert(products)
			.values({
				shopifyId: product.id,
				name: product.title,
				handle: product.handle,
				community: 7,
				requiresShipping: true,
				active: true,
			})
			.returning({ id: products.id });

		for (const variant of product.variants.nodes) {
			const onlyVariant = variant.title.includes("Default Title");

			const hasSize =
				!onlyVariant &&
				/\b(xs|s|m|l|xl|2xl|3xl|4xl|5xl)\b/i.test(variant.title);

			const hasColor =
				!onlyVariant && (variant.title.includes("/") || !hasSize);

			const hasSizeAndColor = hasSize && hasColor;

			const upload = await pinata.upload.public.url(variant.image.url);

			await tx.insert(productVariants).values({
				shopifyId: variant.id,
				product: id,
				price: Number(variant.price),
				inventory:
					Number(variant.inventoryQuantity) === 9999
						? null
						: Number(variant.inventoryQuantity),
				images: [`https://ipfs.nouns.gg/ipfs/${upload.cid}`],
				size: hasSizeAndColor
					? variant.title.split(" / ")[1].toLowerCase()
					: hasSize
						? variant.title.toLowerCase()
						: null,
				color: {
					name: hasSizeAndColor
						? variant.title.split(" / ")[0]
						: hasColor
							? variant.title
							: null,
					hex: "#000000",
				},
			});
		}
	}
});
