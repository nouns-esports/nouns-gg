import { env } from "~/env";
import { and, eq, inArray, isNotNull, or } from "drizzle-orm";
import { nexus, xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { unstable_cache as cache } from "next/cache";
import { cookies } from "next/headers";
import { privyClient } from "../clients/privy";
import { pinataClient } from "../clients/pinata";
import {
	erc721Balances,
	lilnounDelegates,
	nounDelegates,
} from "~/packages/db/schema/indexer";
import { level } from "@/utils/level";
import { toast } from "@/components/Toasts";

export async function getAuthenticatedUser() {
	const token = (await cookies()).get("privy-id-token");

	if (!token) return;

	try {
		const privyUser = await privyClient.getUser({ idToken: token.value });

		let userNexus = await db.pgpool.query.nexus.findFirst({
			where: eq(nexus.id, privyUser.id),
			with: {
				rank: true,
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
				const fullPrivyUser = await privyClient.getUser(privyUser.id);

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
					twitter: fullPrivyUser.twitter?.username,
					discord: fullPrivyUser.discord?.username?.split("#")[0],
					username: fullPrivyUser.farcaster?.username ?? undefined,
					fid: fullPrivyUser.farcaster?.fid ?? undefined,
					canRecieveEmails: false,
					interests: [],
				});

				userNexus = await db.primary.query.nexus.findFirst({
					where: eq(nexus.id, privyUser.id),
					with: {
						rank: true,
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

		const { currentLevel } = level(userNexus.xp);

		return {
			id: privyUser.id,
			discord: privyUser.discord,
			twitter: privyUser.twitter,
			farcaster: privyUser.farcaster,
			wallets: privyUser.linkedAccounts.filter(
				(account) => account.type === "wallet",
			),
			email: privyUser.email,
			nexus: userNexus,
			level: currentLevel,
			votes:
				currentLevel >= 15
					? 10
					: currentLevel >= 10
						? 5
						: currentLevel >= 5
							? 3
							: 1,
		};
	} catch (e) {
		console.error(e);
	}
}

export type AuthenticatedUser = NonNullable<
	Awaited<ReturnType<typeof getAuthenticatedUser>>
>;

export const isInServer = async (input: { subject: string }) => {
	return (
		await fetch(
			`https://discord.com/api/guilds/${env.DISCORD_GUILD_ID}/members/${input.subject}`,
			{
				headers: {
					Authorization: `Bot ${env.DISCORD_TOKEN}`,
				},
			},
		)
	).ok;
};

export const getUser = cache(
	async (input: { user: string }) => {
		return db.pgpool.query.nexus.findFirst({
			where: or(eq(nexus.id, input.user), eq(nexus.username, input.user)),
			with: {
				rank: true,
			},
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

export async function getUserHasCredential(input: {
	token: string;
	wallets: string[];
}) {
	if (input.wallets.includes("0xe3ff24a97bfb65cadef30f6ad19a6ea7e6f6149d")) {
		console.log("Checking for Sam");
	}

	const holder = await db.pgpool.query.erc721Balances.findFirst({
		where: and(
			inArray(
				erc721Balances.account,
				input.wallets.map((w) => w.toLowerCase() as `0x${string}`),
			),
			eq(erc721Balances.collection, input.token.toLowerCase()),
		),
	});

	if (input.wallets.includes("0xe3ff24a97bfb65cadef30f6ad19a6ea7e6f6149d")) {
		console.log("Sam Holder", holder);
	}

	if (holder) {
		return true;
	}

	if (
		input.token.toLowerCase() === "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03"
	) {
		const nounDelegate = await db.pgpool.query.nounDelegates.findFirst({
			where: inArray(
				nounDelegates.to,
				input.wallets.map((w) => w.toLowerCase() as `0x${string}`),
			),
		});

		if (input.wallets.includes("0xe3ff24a97bfb65cadef30f6ad19a6ea7e6f6149d")) {
			console.log("Sam Noun Delegate", nounDelegate);
		}

		if (nounDelegate) {
			return true;
		}
	}

	if (
		input.token.toLowerCase() === "0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b"
	) {
		const lilnounDelegate = await db.pgpool.query.lilnounDelegates.findFirst({
			where: inArray(
				lilnounDelegates.to,
				input.wallets.map((w) => w.toLowerCase() as `0x${string}`),
			),
		});

		if (lilnounDelegate) {
			return true;
		}
	}

	return false;
}
