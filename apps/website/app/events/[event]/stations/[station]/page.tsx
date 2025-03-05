import { xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { getAuthenticatedUser } from "@/server/queries/users";
import { redirect } from "next/navigation";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { getStation } from "@/server/queries/stations";
import CheckInOnClient from "@/components/CheckInOnClient";

export default async function Station(props: {
	params: Promise<{ event: string; station: string }>;
}) {
	const params = await props.params;

	const now = new Date();

	const [user, station] = await Promise.all([
		getAuthenticatedUser(),
		getStation({ id: Number(params.station) }),
	]);

	if (!station?.event) {
		redirect("/events");
	}

	if (!user) {
		return <CheckInOnClient station={station} />;
	}

	const alreadyClaimed = await db.query.xp.findFirst({
		where: and(eq(xp.user, user.id), eq(xp.station, Number(params.station))),
	});

	if (alreadyClaimed) {
		return redirect(
			`/events/${params.event}/stations?claimed=${alreadyClaimed.id}`,
		);
	}

	const [record] = await db
		.insert(xp)
		.values({
			user: user.id,
			timestamp: now,
			station: Number(params.station),
			amount: station.xp,
		})
		.returning({ id: xp.id });

	console.log("claiming", record.id);

	return redirect(`/events/${params.event}/stations?claimed=${record.id}`);
}
