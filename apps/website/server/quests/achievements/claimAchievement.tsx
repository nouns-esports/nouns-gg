import { and, eq } from "drizzle-orm";
import createAction from "../createAction";
import { xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { achievements } from "@/server/achievements";

export const claimAchievement = createAction<{ achievement?: string }>(
	async (actionInputs) => {
		const achievement = actionInputs.achievement
			? achievements[actionInputs.achievement]
			: undefined;

		return {
			description: (
				<p>
					{achievement ? (
						<>
							Claim the <span className="text-red">{achievement.name}</span>{" "}
							achievement
						</>
					) : (
						"Claim any achievement"
					)}
				</p>
			),
			url: "/nexus",
			check: async (user) => {
				const claimedAchievement = await db.primary.query.xp.findFirst({
					where: and(
						eq(xp.user, user.id),
						actionInputs.achievement
							? eq(xp.achievement, actionInputs.achievement)
							: undefined,
					),
				});

				if (!claimedAchievement) return false;

				return true;
			},
		};
	},
);
