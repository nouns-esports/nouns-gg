import { getAuthenticatedUser } from "@/server/queries/users";
import { eq } from "drizzle-orm";
import { notFound, redirect, RedirectType } from "next/navigation";
import { links, snapshots } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

export default async function LinkRoute(props: {
	params: Promise<{ link: string[] }>;
	searchParams: Promise<{ capture?: boolean }>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;

	const link = await db.query.links.findFirst({
		where: eq(links.id, params.link[0]),
	});

	if (link) {
		const url = new URL(link.url);

		if (searchParams.capture) {
			const user = await getAuthenticatedUser();

			if (user) {
				await db.insert(snapshots).values({
					type: "visit-link",
					timestamp: new Date(),
					tag: link.id,
					user: user.id,
				});
			}
		}

		redirect(
			`${url.origin}${url.pathname}${params.link.slice(1).join("/")}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ""}`,
			RedirectType.replace,
		);
	}

	return notFound();
}
