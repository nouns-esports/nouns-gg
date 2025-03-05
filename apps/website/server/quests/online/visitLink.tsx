import { links, snapshots } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import createAction from "../createAction";
import { and, eq } from "drizzle-orm";

export const visitLink = createAction(async (actionInputs) => {
	if (!actionInputs.link) {
		throw new Error("Link input missing in action");
	}

	if (!actionInputs.type) {
		throw new Error("Type input missing in action");
	}

	const link = await db.query.links.findFirst({
		where: eq(links.id, actionInputs.link),
	});

	if (!link) {
		throw new Error("Link not found");
	}

	return {
		description: {
			website: (
				<p>
					Visit{" "}
					<span className="text-red">
						{actionInputs.name ?? link.url.slice(8).split("/")[0]}
					</span>
				</p>
			),
			post: (
				<p>
					View {!actionInputs.name ? "this " : ""}
					<span className="text-red">{actionInputs.name ?? "post"}</span>
				</p>
			),
			sharePost: (
				<p>
					Share {!actionInputs.name ? "this " : ""}
					<span className="text-red">{actionInputs.name ?? "post"}</span>
				</p>
			),
			video: (
				<p>
					Watch {!actionInputs.name ? "this " : ""}
					<span className="text-red">{actionInputs.name ?? "video"}</span>
				</p>
			),
			article: (
				<p>
					Read {!actionInputs.name ? "this " : ""}
					<span className="text-red">{actionInputs.name ?? "article"}</span>
				</p>
			),
			stream: (
				<p>
					Tune into the <span className="text-red">stream</span>
				</p>
			),
		}[
			actionInputs.type as
				| "website"
				| "video"
				| "stream"
				| "post"
				| "article"
				| "sharePost"
		],
		url: `/${link.id}?capture=true`,
		check: async (user) => {
			if (!link) return false;

			const snapshot = await db.query.snapshots.findFirst({
				where: and(
					eq(snapshots.user, user.id),
					eq(snapshots.type, "visit-link"),
					eq(snapshots.tag, link.id),
				),
			});

			if (!snapshot) return false;

			return true;
		},
	};
});
