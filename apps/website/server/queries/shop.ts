import {
	collections,
	products,
} from "@/server/data/archive";

export async function getProducts(input: {
	collection?: string;
	event?: string;
	community?: string;
}) {
	return products.filter(
		(product) =>
			product.active &&
			(!input.collection ||
				product.collectionHandle === input.collection) &&
			(!input.event || product.eventId === input.event) &&
			(!input.community ||
				product.community.id === input.community ||
				product.community.handle === input.community),
	);
}

export async function getCollections() {
	return collections;
}

export async function getProduct(input: { handle: string }) {
	return products.find((product) => product.handle === input.handle);
}

export async function getCollection(input: { handle: string }) {
	const collection = collections.find(
		(candidate) => candidate.handle === input.handle,
	);
	if (!collection) return undefined;
	return {
		...collection,
		products: products.filter(
			(product) => product.collectionHandle === collection.handle,
		),
	};
}

export async function checkCart(_input: { user: string }) {
	return false;
}

export async function estimateOrderCost(_input: {
	items: Array<{ shopifyId: string; quantity: number }>;
	shipping: Record<string, unknown>;
}) {
	return { tax: 0, shipping: 0 };
}
