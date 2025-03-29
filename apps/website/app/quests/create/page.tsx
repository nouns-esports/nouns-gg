import { getAuthenticatedUser } from "@/server/queries/users";
import { redirect, RedirectType } from "next/navigation";

export default async function CreateQuest() {
	const user = await getAuthenticatedUser();

	if (!user?.nexus || !user.nexus.admin) {
		return redirect("/quests", RedirectType.replace);
	}
}
