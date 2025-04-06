import { getAuthenticatedUser } from "@/server/queries/users";
import { redirect } from "next/navigation";

export default async function UserPage() {
	const user = await getAuthenticatedUser();

	if (user) {
		return redirect(`/users/${user.nexus?.username ?? user.id}`);
	}

	return redirect("/");
}
