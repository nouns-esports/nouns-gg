import { getEvent } from "@/server/queries/events";
import { isUUID } from "@/utils/isUUID";
import { notFound, redirect } from "next/navigation";

export async function GET(request: Request) {
	const url = new URL(request.url);

	const params = {
		event: url.searchParams.get("event"),
	};

	if (!params.event) {
		return notFound();
	}

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
