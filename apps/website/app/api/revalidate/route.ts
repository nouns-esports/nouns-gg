import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	const path = searchParams.get("path");

	if (!path) {
		return Response.json({ error: "Path is required" }, { status: 400 });
	}

	revalidatePath(path);

	return Response.json({ revalidated: true });
}
