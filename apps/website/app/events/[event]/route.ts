import { getEvent } from "@/server/queries/events";
import { isUUID } from "@/utils/isUUID";
import { notFound, redirect } from "next/navigation";

export async function GET(props: { params: Promise<{ event: string }> }) {
	const params = await props.params;

	if (isUUID(params.event)) {
		const event = await getEvent({ id: params.event });

		if (!event) {
			return notFound();
		}

		return redirect(`/c/${event.community.handle}/events/${event.handle}`);
	}

	const event = await getEvent({ handle: params.event });

	if (!event) {
		return notFound();
	}

	return redirect(`/c/${event.community.handle}/events/${event.handle}`);
}
