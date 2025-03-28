import { getAuthenticatedUser } from "@/server/queries/users";
import { redirect, RedirectType } from "next/navigation";

export default async function CreateRound() {
	const user = await getAuthenticatedUser();

	if (!user?.nexus || !user.nexus.admin) {
		return redirect("/rounds", RedirectType.replace);
	}
}
