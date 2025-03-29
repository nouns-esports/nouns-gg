import { getAuthenticatedUser } from "@/server/queries/users";
import { redirect, RedirectType } from "next/navigation";

export default async function CreatePrediction() {
	const user = await getAuthenticatedUser();

	if (!user?.nexus || !user.nexus.admin) {
		return redirect("/predictions", RedirectType.replace);
	}
}
