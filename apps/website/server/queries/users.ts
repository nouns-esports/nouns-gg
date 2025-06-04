import { env } from "~/env";
import { and, eq, inArray, isNotNull, or, sql } from "drizzle-orm";
import { leaderboards, nexus, xp } from "~/packages/db/schema/public";
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
			where: eq(nexus.id, privyUser.id),
			with: {
				leaderboards: {
					extras: {
						percentile: sql<number>`
							(
								(
									SELECT 1 + COUNT(*) 
									FROM ${leaderboards} AS l2 
									WHERE l2.community = ${leaderboards.community}
									AND l2.xp > ${leaderboards.xp}
								)::float
								/
								(
									SELECT COUNT(*) 
									FROM ${leaderboards} AS l3 
									WHERE l3.community = ${leaderboards.community}
								)
							)
						`.as("percentile"),
					}
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
			if (!userNexus) {
				const fullPrivyUser = await privyClient.getUserById(privyUser.id);

				const image = await pinataClient.upload.url(
					fullPrivyUser.farcaster?.pfp ??
					fullPrivyUser.twitter?.profilePictureUrl ??
					`https://api.cloudnouns.com/v1/pfp?text=${privyUser.id}&background=1`,
				);

				await db.primary.insert(nexus).values({
					id: privyUser.id,
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
				});

				userNexus = await db.primary.query.nexus.findFirst({
					where: eq(nexus.id, privyUser.id),
					with: {
						leaderboards: {
							extras: {
								percentile: sql<number>`
									(
										(
											SELECT 1 + COUNT(*) 
											FROM ${leaderboards} AS l2 
											WHERE l2.community = ${leaderboards.community}
											AND l2.xp > ${leaderboards.xp}
										)::float
										/
										(
											SELECT COUNT(*) 
											FROM ${leaderboards} AS l3 
											WHERE l3.community = ${leaderboards.community}
										)
									)
								`.as("percentile"),
							}
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
		} catch (e) {
			toast.error(`Error creating user: ${e}`);
		}

		if (!userNexus) {
			return;
		}

		// const { currentLevel } = level(userNexus.xp);

		return {
			id: privyUser.id,
			discord: privyUser.discord,
			twitter: privyUser.twitter,
			farcaster: privyUser.farcaster,
			wallets: privyUser.linkedAccounts.filter(
				(account) => account.type === "wallet",
			) ?? [],
			email: privyUser.email,
			nexus: userNexus,
			// level: currentLevel,
			// votes:
			// 	currentLevel >= 15
			// 		? 10
			// 		: currentLevel >= 10
			// 			? 5
			// 			: currentLevel >= 5
			// 				? 3
			// 				: 1,
		};
	} catch (e) {
		console.error(e);
	}
}

export const getUser = cache(
	async (input: { user: string }) => {

		return db.pgpool.query.nexus.findFirst({
			where: eq(nexus.id, input.user),
		});

	},
	["getUser"],
	{ tags: ["getUser"], revalidate: 60 * 10 },
);

export const getUserStats = cache(
	async (input: { user: string }) => {
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
	},
	["getUserStats"],
	{ tags: ["getUserStats"], revalidate: 60 * 10 },
);
