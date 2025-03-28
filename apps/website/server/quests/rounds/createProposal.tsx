import { and, eq } from "drizzle-orm";
import createAction from "../createAction";
import { proposals, rounds } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

export const createProposal = createAction<{ round?: string }>(
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
					Create a proposal in <span className="text-red">{round.name}</span>
				</p>
			) : (
				<p>Create a proposal</p>
			),
			url: round ? `/rounds/${round.id}` : "/rounds",
			check: async (user) => {
				const proposal = await db.primary.query.proposals.findFirst({
					where: and(
						eq(proposals.user, user.id),
						round ? eq(proposals.round, round.id) : undefined,
					),
				});

				if (!proposal) return false;

				return true;
			},
		};
	},
);
