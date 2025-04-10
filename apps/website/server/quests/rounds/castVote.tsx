import { and, eq } from "drizzle-orm";
import createAction from "../createAction";
import { rounds, votes } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

export const castVote = createAction<{ round?: number }>(
	async (actionInputs) => {
		let round:
			| Awaited<ReturnType<typeof db.primary.query.rounds.findFirst>>
			| undefined;

		if (actionInputs.round) {
			round = await db.primary.query.rounds.findFirst({
				where: eq(rounds.id, actionInputs.round),
			});
		}

		return {
			description: round ? (
				<p>
					Vote on a proposal in <span className="text-red">{round.name}</span>
				</p>
			) : (
				<p>Vote on any proposal</p>
			),
			url: round ? `/rounds/${round.handle}` : "/rounds",
			check: async (user) => {
				const vote = await db.primary.query.votes.findFirst({
					where: and(
						eq(votes.user, user.id),
						round ? eq(votes.round, round.id) : undefined,
					),
				});

				if (!vote) return false;

				return true;
			},
		};
	},
);
