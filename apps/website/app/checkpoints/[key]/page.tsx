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
import { eq, sql } from "drizzle-orm";
import SignIn from "@/components/SignIn";
import { Check } from "lucide-react";
import Button from "@/components/Button";

export default async function Checkpoint(props: {
	params: Promise<{ key: string }>;
}) {
	const params = await props.params;
	const now = new Date();

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

	if (checkpoint.checkins.length === 0) {
		await db.primary.transaction(async (tx) => {
			const [checkin] = await tx
				.insert(checkins)
				.values({
					checkpoint: checkpoint.id,
					user: user.id,
					timestamp: now,
				})
				.returning({ id: checkins.id });

			if (checkpoint.xp !== null) {
				didEarnXP = true;
				await tx.insert(xp).values({
					user: user.id,
					timestamp: now,
					checkin: checkin.id,
					amount: checkpoint.xp,
					community: 7,
				});

				await tx
					.insert(leaderboards)
					.values({
						user: user.id,
						xp: checkpoint.xp,
						community: 7,
					})
					.onConflictDoUpdate({
						target: [leaderboards.user, leaderboards.community],
						set: {
							xp: sql`${leaderboards.xp} + ${checkpoint.xp}`,
						},
					});
			}

			if (checkpoint.gold !== null) {
				didEarnGold = true;
				await tx.insert(gold).values({
					to: user.id,
					timestamp: now,
					checkin: checkin.id,
					amount: checkpoint.gold,
				});
			}

			if (checkpoint.xp !== null) {
				const [updateNexus] = await tx
					.update(nexus)
					.set({
						xp: sql`${nexus.xp} + ${checkpoint.xp}`,
					})
					.where(eq(nexus.id, user.id))
					.returning({
						xp: nexus.xp,
					});

				totalXP = updateNexus.xp;
			}

			if (checkpoint.gold !== null) {
				await tx
					.update(nexus)
					.set({
						gold: sql`${nexus.gold} + ${checkpoint.gold}`,
					})
					.where(eq(nexus.id, user.id));
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
					<Button href="/">Back to Home</Button>
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
