import {
	checkins,
	gold,
	leaderboards,
	nexus,
	xp,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { getAuthenticatedUser } from "@/server/queries/users";
import { redirect } from "next/navigation";
import { getCheckpoint } from "@/server/queries/checkpoints";
import { Toast } from "@/components/Toasts";
import { and, eq, sql } from "drizzle-orm";
import SignIn from "@/components/SignIn";
import { Check } from "lucide-react";
import Button from "@/components/Button";

export default async function Checkpoint(props: {
	params: Promise<{ key: string }>;
}) {
	const params = await props.params;

	const user = await getAuthenticatedUser();
	const checkpoint = await getCheckpoint({ key: params.key, user: user?.id });

	if (!checkpoint) {
		return redirect("/");
	}

	if (!user?.nexus) {
		return <SignIn />;
	}

	let totalXP = 0;
	let didEarnXP = false;
	let didEarnGold = false;

	const nounsgg = "98e09ea8-4c19-423c-9733-b946b6f70902";

	if (checkpoint.checkins.length === 0) {
		await db.primary.transaction(async (tx) => {
			const [checkin] = await tx
				.insert(checkins)
				.values({
					checkpoint: checkpoint.id,
					user: user.id,
				})
				.returning({ id: checkins.id });

			if (checkpoint.xp !== null) {
				didEarnXP = true;
				await tx.insert(xp).values({
					user: user.id,
					checkin: checkin.id,
					checkpoint: checkpoint.id,
					amount: checkpoint.xp,
					community: nounsgg,
					for: "CHECKING_IN",
				});

				const [updatePass] = await tx
					.insert(leaderboards)
					.values({
						user: user.id,
						xp: checkpoint.xp,
						community: nounsgg,
					})
					.onConflictDoUpdate({
						target: [leaderboards.user, leaderboards.community],
						set: {
							xp: sql`${leaderboards.xp} + ${checkpoint.xp}`,
						},
					})
					.returning({
						xp: leaderboards.xp,
					});

				totalXP = updatePass.xp;
			}

			if (checkpoint.gold !== null) {
				didEarnGold = true;
				await tx.insert(gold).values({
					to: user.id,
					checkin: checkin.id,
					checkpoint: checkpoint.id,
					amount: checkpoint.gold,
					community: nounsgg,
					for: "CHECKING_IN",
				});
			}

			if (checkpoint.gold !== null) {
				await tx
					.insert(leaderboards)
					.values({
						user: user.id,
						points: checkpoint.gold,
						community: nounsgg,
					})
					.onConflictDoUpdate({
						target: [leaderboards.user, leaderboards.community],
						set: {
							points: sql`${leaderboards.points} + ${checkpoint.gold}`,
						},
					});
			}
		});
	}

	return (
		<>
			<div className="w-screen h-screen flex justify-center items-center">
				<div className="w-full flex flex-col items-center gap-4">
					<h1 className="text-white text-4xl font-luckiest-guy">
						{checkpoint.name}
					</h1>
					<p className="text-green flex items-center gap-1.5">
						<Check className="w-4 h-4" />
						Claimed
					</p>
					<Button href="/predict">View Predictions</Button>
				</div>
			</div>
			{didEarnXP && checkpoint.xp !== null ? (
				<Toast
					type="xp"
					inputs={{
						total: totalXP,
						earned: checkpoint.xp,
					}}
				/>
			) : null}
			{didEarnGold && checkpoint.gold !== null ? (
				<Toast
					type="gold"
					inputs={{
						earned: Number(checkpoint.gold),
					}}
				/>
			) : null}
		</>
	);
}
