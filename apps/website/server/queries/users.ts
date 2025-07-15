import { env } from "~/env";
import { and, eq, inArray, isNotNull, or, sql } from "drizzle-orm";
import { accounts, leaderboards, nexus, xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { unstable_cache as cache } from "next/cache";
import { cookies } from "next/headers";
import { privyClient } from "../clients/privy";
import { pinataClient } from "../clients/pinata";
import { level } from "@/utils/level";
import { toast } from "@/components/Toasts";

export type AuthenticatedUser = NonNullable<
	Awaited<ReturnType<typeof getAuthenticatedUser>>
>;

export async function getAuthenticatedUser() {
	const token = (await cookies()).get("privy-id-token");

	if (!token) return;

	try {
		const privyUser = await privyClient.getUser({ idToken: token.value });

		let userNexus = await db.pgpool.query.nexus.findFirst({
			where: eq(nexus.privyId, privyUser.id),
			with: {
				accounts: true,
				leaderboards: {
					with: {
						community: true,
					},
					extras: {
						percentile: sql<number>`
							(
								(
									SELECT 1 + COUNT(*) 
									FROM ${leaderboards} AS l2 
									WHERE l2.community = ${leaderboards.community}
									AND l2.xp > ${leaderboards.xp}
									AND l2.xp > 0
								)::float
								/
								(
									SELECT COUNT(*) 
									FROM ${leaderboards} AS l3 
									WHERE l3.community = ${leaderboards.community}
									AND l3.xp > 0
								)
							)
						`.as("percentile"),
					},
				},
				carts: {
					with: {
						product: {
							with: {
								variants: true,
							},
						},
						variant: true,
					},
				},
			},
		});

		try {
			await db.primary.transaction(async (tx) => {
				if (!userNexus) {
					const fullPrivyUser = await privyClient.getUserById(privyUser.id);

					const image = await pinataClient.upload.url(
						fullPrivyUser.farcaster?.pfp ??
							fullPrivyUser.twitter?.profilePictureUrl ??
							`https://api.cloudnouns.com/v1/pfp?text=${privyUser.id}&background=1`,
					);

					const [createdNexus] = await tx
						.insert(nexus)
						.values({
							privyId: privyUser.id,
							name:
								fullPrivyUser.farcaster?.displayName ??
								fullPrivyUser.twitter?.name ??
								fullPrivyUser.discord?.username?.split("#")[0] ??
								fullPrivyUser.email?.address.split("@")[0] ??
								privyUser.id.replace("did:privy:", "").substring(0, 8),
							image: `https://ipfs.nouns.gg/ipfs/${image.IpfsHash}`,
							bio: fullPrivyUser.farcaster?.bio ?? "",
							canRecieveEmails: false,
							discord: fullPrivyUser.discord?.username ?? null,
							twitter: fullPrivyUser.twitter?.username ?? null,
							fid: fullPrivyUser.farcaster?.fid ?? null,
						})
						.onConflictDoNothing()
						.returning();

					for (const account of fullPrivyUser.linkedAccounts) {
						if (account.type === "discord_oauth") {
							await tx
								.insert(accounts)
								.values({
									user: createdNexus.id,
									platform: "discord",
									identifier: account.subject,
								})
								.onConflictDoUpdate({
									target: [accounts.platform, accounts.identifier],
									set: {
										user: createdNexus.id,
									},
								});
						}

						if (account.type === "twitter_oauth") {
							await tx
								.insert(accounts)
								.values({
									user: createdNexus.id,
									platform: "twitter",
									identifier: account.subject,
								})
								.onConflictDoUpdate({
									target: [accounts.platform, accounts.identifier],
									set: {
										user: createdNexus.id,
									},
								});
						}

						if (account.type === "farcaster") {
							await tx
								.insert(accounts)
								.values({
									user: createdNexus.id,
									platform: "farcaster",
									identifier: account.fid.toString(),
								})
								.onConflictDoUpdate({
									target: [accounts.platform, accounts.identifier],
									set: {
										user: createdNexus.id,
									},
								});
						}
					}

					userNexus = await tx.query.nexus.findFirst({
						where: eq(nexus.privyId, privyUser.id),
						with: {
							accounts: true,
							leaderboards: {
								with: {
									community: true,
								},
								extras: {
									percentile: sql<number>`
									(
										(
											SELECT 1 + COUNT(*) 
											FROM ${leaderboards} AS l2 
											WHERE l2.community = ${leaderboards.community}
											AND l2.xp > ${leaderboards.xp}
											AND l2.xp > 0
										)::float
										/
										(
											SELECT COUNT(*) 
											FROM ${leaderboards} AS l3 
											WHERE l3.community = ${leaderboards.community}
											AND l3.xp > 0
										)
									)
								`.as("percentile"),
								},
							},
							carts: {
								with: {
									product: {
										with: {
											variants: true,
										},
									},
									variant: true,
								},
							},
						},
					});

					if (!userNexus) {
						toast.error("Error creating user");
					}
				}
			});
		} catch (e) {
			toast.error(`Error creating user: ${e}`);
		}

		if (!userNexus) {
			return;
		}

		const nounsgg = "98e09ea8-4c19-423c-9733-b946b6f70902";

		return {
			id: userNexus.id,
			privyId: privyUser.id,
			discord: privyUser.discord,
			twitter: privyUser.twitter,
			farcaster: privyUser.farcaster,
			wallets:
				privyUser.linkedAccounts.filter(
					(account) => account.type === "wallet",
				) ?? [],
			email: privyUser.email,
			nexus: userNexus,
			gold:
				userNexus.leaderboards.find(
					(leaderboard) => leaderboard.community === nounsgg,
				)?.points ?? 0,
		};
	} catch (e) {
		console.error(e);
	}
}

export async function getUser(input: { id: string } | { privy: string }) {
	return db.pgpool.query.nexus.findFirst({
		where:
			"id" in input ? eq(nexus.id, input.id) : eq(nexus.privyId, input.privy),
	});
}

export async function getUserStats(input: { user: string }) {
	const user = await db.pgpool.query.nexus.findFirst({
		where: eq(nexus.id, input.user),
		with: {
			proposals: true,
			xpRecords: {
				where: isNotNull(xp.quest),
			},
			votes: true,
		},
	});

	return {
		proposalsCreated: user?.proposals.length ?? 0,
		questsCompleted: user?.xpRecords.length ?? 0,
		votesCast: user?.votes.length ?? 0,
	};
}
