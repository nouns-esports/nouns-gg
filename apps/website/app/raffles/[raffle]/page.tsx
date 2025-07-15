import { getRaffle } from "@/server/queries/raffles";
import { isUUID } from "@/utils/isUUID";
import { notFound, redirect } from "next/navigation";

export default async function Raffle(props: {
	params: Promise<{ raffle: string }>;
}) {
	const params = await props.params;

	if (isUUID(params.raffle)) {
		const raffle = await getRaffle({ id: params.raffle });

		if (!raffle) {
			return notFound();
		}

		return redirect(`/c/${raffle.community.handle}?tab=shop`);
	}

	const raffle = await getRaffle({ handle: params.raffle });

	if (!raffle) {
		return notFound();
	}

	return redirect(`/c/${raffle.community.handle}?tab=shop`);
}
