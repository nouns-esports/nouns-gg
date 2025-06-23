import { getRound } from "@/server/queries/rounds";
import { isUUID } from "@/utils/isUUID";
import { notFound, redirect } from "next/navigation";

export async function GET(request: Request) {
	const url = new URL(request.url);

	const params = {
		round: url.searchParams.get("round"),
	};

	if (!params.round) {
		return notFound();
	}

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
