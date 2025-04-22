import { getAuthenticatedUser } from "@/server/queries/users";
import { redirect, RedirectType } from "next/navigation";
import { db } from "~/packages/db";
import { visits } from "~/packages/db/schema/public";
import { and, eq } from "drizzle-orm";

export default async function VisitPage(props: {
	searchParams: Promise<{
		url?: string;
	}>;
}) {
	const [searchParams, user] = await Promise.all([
		props.searchParams,
		getAuthenticatedUser(),
	]);

	if (!user || !searchParams.url) {
		redirect("/");
	}

	let url: URL;

	try {
		url = new URL(searchParams.url);
	} catch (error) {
		console.error("Invalid URL Redirect", error);
		redirect("/");
	}

	const visited = await db.primary.query.visits.findFirst({
		where: and(eq(visits.user, user.id), eq(visits.url, url.toString())),
	});

	if (visited) {
		redirect(url.toString(), RedirectType.replace);
	}

	await db.primary.insert(visits).values({
		user: user.id,
		url: url.toString(),
		timestamp: new Date(),
	});

	redirect(url.toString(), RedirectType.replace);
}
