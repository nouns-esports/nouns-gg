export function POST() {
	return Response.json(
		{ error: "Shopify webhooks are unavailable" },
		{ status: 410 },
	);
}
