export function POST() {
	return Response.json(
		{ error: "Privy webhooks are unavailable" },
		{ status: 410 },
	);
}
