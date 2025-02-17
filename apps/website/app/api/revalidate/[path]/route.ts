import { revalidatePath } from "next/cache";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ path: string }> },
) {
	revalidatePath((await params).path);
	return Response.json({ revalidated: true });
}
