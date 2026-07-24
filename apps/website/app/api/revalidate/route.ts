export function GET() {
	return Response.json(
		{ error: "Runtime revalidation is unavailable" },
		{ status: 410 },
	);
}
