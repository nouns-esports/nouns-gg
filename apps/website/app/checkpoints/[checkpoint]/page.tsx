import { checkins, gold, nexus, xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { getAuthenticatedUser } from "@/server/queries/users";
import { redirect } from "next/navigation";
import { getCheckpoint } from "@/server/queries/checkpoints";
import { Toast } from "@/components/Toasts";
import { eq, sql } from "drizzle-orm";
import SignIn from "@/components/SignIn";

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

	if (checkpoint.checkins.length === 0) {
		await db.transaction(async (tx) => {
			const [checkin] = await tx
				.insert(checkins)
				.values({
					checkpoint: checkpoint.id,
					user: user.id,
					timestamp: now,
				})
				.returning({ id: checkins.id });

			if (checkpoint.xp) {
				await tx.insert(xp).values({
					user: user.id,
					timestamp: now,
					checkin: checkin.id,
					amount: checkpoint.xp,
				});
			}

			if (checkpoint.gold) {
				await tx.insert(gold).values({
					to: user.id,
					timestamp: now,
					checkin: checkin.id,
					amount: checkpoint.gold,
				});
			}

			if (checkpoint.xp) {
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

			if (checkpoint.gold) {
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
			<div>CHeckpoint claimed</div>
			{checkpoint.xp ? (
				<Toast
					type="xp"
					inputs={{
						total: totalXP,
						earned: checkpoint.xp,
					}}
				/>
			) : null}
			{checkpoint.gold ? (
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
