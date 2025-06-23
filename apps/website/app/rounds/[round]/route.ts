import { getRound } from "@/server/queries/rounds";
import { isUUID } from "@/utils/isUUID";
import { notFound, redirect } from "next/navigation";

export default async function Round(props: {
	params: Promise<{ round: string }>;
}) {
	const params = await props.params;

	if (isUUID(params.round)) {
		const round = await getRound({ id: params.round });

		if (!round) {
			return notFound();
		}

		return redirect(`/c/${round.community.handle}/rounds/${round.handle}`);
	}

	const round = await getRound({ handle: params.round });

	if (!round) {
		return notFound();
	}

	return redirect(`/c/${round.community.handle}/rounds/${round.handle}`);
}
