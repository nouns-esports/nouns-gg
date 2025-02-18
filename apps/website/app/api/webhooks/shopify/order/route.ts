// 10 xp per $ spent (not shipping)
type OrderUpdated = {
	admin_graphql_api_id: string;
};

export async function POST(request: Request) {
	const body = await request.json();
	console.log("SHOPIFY WEBHOOK RECEIVED");
	console.log("REQUEST", request);
	console.log("BODY", body);
}
