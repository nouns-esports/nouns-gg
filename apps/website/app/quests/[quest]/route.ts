import { getQuest } from "@/server/queries/quests";
import { isUUID } from "@/utils/isUUID";
import { notFound, redirect } from "next/navigation";

export async function GET(request: Request) {
	const url = new URL(request.url);

	const params = {
		quest: url.searchParams.get("quest"),
	};

	if (!params.quest) {
		return notFound();
	}

	if (isUUID(params.quest)) {
		const quest = await getQuest({ handle: params.quest });

		if (!quest) {
			return notFound();
		}

		return redirect(`/c/${quest.community.handle}/quests/${quest.handle}`);
	}

	const quest = await getQuest({ handle: params.quest });

	if (!quest) {
		return notFound();
	}

	return redirect(`/c/${quest.community.handle}/quests/${quest.handle}`);
}
