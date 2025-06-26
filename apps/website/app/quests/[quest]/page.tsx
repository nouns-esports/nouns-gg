import { getQuest } from "@/server/queries/quests";
import { isUUID } from "@/utils/isUUID";
import { notFound, redirect } from "next/navigation";

export default async function Quest(props: {
	params: Promise<{ quest: string }>;
}) {
	const params = await props.params;

	if (isUUID(params.quest)) {
		const quest = await getQuest({ id: params.quest });

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
