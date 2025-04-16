import Link from "@/components/Link";
import { getLeaderboard, getRank } from "@/server/queries/leaderboard";
import { getAuthenticatedUser } from "@/server/queries/users";
import { CaretUp, CaretDown } from "phosphor-react-sc";
import { twMerge } from "tailwind-merge";
import { ToggleModal } from "@/components/Modal";
import { Image, Info } from "lucide-react";
import ShareRankingModal from "@/components/modals/ShareRankingModal";
import { env } from "~/env";
import type { Metadata } from "next";
import RankingSystemExplainer from "@/components/modals/RankingSystemExplainer";
import { level } from "@/utils/level";

export async function generateMetadata(props: {
	searchParams: Promise<{
		user?: string;
	}>;
}): Promise<Metadata> {
	const searchParams = await props.searchParams;

	return {
		title: "Leaderboard",
		openGraph: {
			type: "website",
			images: [
				searchParams.user
					? `${env.NEXT_PUBLIC_DOMAIN}/api/images/rankings?user=${searchParams.user}`
					: "https://ipfs.nouns.gg/ipfs/bafybeiferg6nxgmjsapfp422rav7cjqj2upb4cd7p5jrat5bcfk2xe2g2u",
			],
		},
		twitter: {
			site: "@NounsGG",
			card: "summary_large_image",
			images: [
				searchParams.user
					? `${env.NEXT_PUBLIC_DOMAIN}/api/images/rankings?user=${searchParams.user}`
					: "https://ipfs.nouns.gg/ipfs/bafybeiferg6nxgmjsapfp422rav7cjqj2upb4cd7p5jrat5bcfk2xe2g2u",
			],
		},
		other: {
			"fc:frame": JSON.stringify({
				version: "next",
				imageUrl: searchParams.user
					? `${env.NEXT_PUBLIC_DOMAIN}/api/images/rankings?user=${searchParams.user}`
					: "https://ipfs.nouns.gg/ipfs/bafybeihnv5usxyzvqxhrwo6pz77blsgvzzybw5g5k3qe533usqvvc6tiya",
				button: {
					title: "View Leaderboard",
					action: {
						type: "launch_frame",
						name: "Nouns GG",
						url: `${env.NEXT_PUBLIC_DOMAIN}/leaderboard`,
						splashImageUrl:
							"https://ipfs.nouns.gg/ipfs/bafkreia2vysupa4ctmftg5ro73igggkq4fzgqjfjqdafntylwlnfclziey",
						splashBackgroundColor: "#040404",
					},
				},
			}),
		},
	};
}

export default async function Leaderboard() {
	const user = await getAuthenticatedUser();

	const [leaderboard, userRank] = await Promise.all([
		getLeaderboard(),
		user
			? getRank({
					user: user.id,
				})
			: undefined,
	]);

	return (
		<>
			<div className="flex flex-col items-center gap-16 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
				<div className="flex flex-col w-full max-w-screen-md gap-8">
					<div className="flex gap-8 items-center justify-between max-sm:gap-4 max-sm:flex-col max-sm:items-start">
						<div className="flex flex-col gap-2">
							<h2 className="text-white text-3xl font-luckiest-guy leading-none">
								Leaderboard
							</h2>
							<p className="max-w-lg">
								Earn xp as you engage with the Nouns community and compete with
								other players for the top ranks! The most engaged players earn
								gold to spend on exclusive items and experiences in the shop.
							</p>
						</div>
					</div>
					{/* {userRank ? (
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 justify-between items-center">
								<p className="text-white text-lg font-semibold">
									Your position
								</p>
								<ToggleModal
									id="share-ranking"
									className="flex items-center gap-1.5 text-red hover:text-red/70 transition-colors"
								>
									<Image className="w-4 h-4" />
									View Image
								</ToggleModal>
							</div>

							<LeaderboardPosition
								position={userRank.rank}
								user={user}
								rank={user.rank}
								gold={Number(user.gold?.amount) ?? 0}
								diff={
									userRank.previousPosition
										? userRank.previousPosition - userRank.rank
										: 0
								}
							/>
						</div>
					) : null} */}

					<div className="relative flex flex-col gap-2">
						<div className="flex gap-2 items-center justify-between">
							<p className="text-white text-lg font-semibold">All Time</p>
							<ToggleModal
								id="ranking-system-explainer"
								className="flex items-center gap-1.5 text-red hover:text-red/70 transition-colors"
							>
								<Info className="w-4 h-4" />
								How do I earn XP?
							</ToggleModal>
						</div>
						{leaderboard.map((user, index) => {
							const position = index + 1;

							return (
								<LeaderboardPosition
									key={user.id}
									position={position}
									user={user}
								/>
							);
						})}
					</div>
				</div>
			</div>
			{/* {userPosition ? <ShareRankingModal ranking={userPosition} /> : null} */}
			<RankingSystemExplainer />
		</>
	);
}

function LeaderboardPosition(props: {
	user: NonNullable<Awaited<ReturnType<typeof getLeaderboard>>[number]>;
	position: number;
}) {
	const { currentLevel } = level(props.user.xp);

	return (
		<Link
			href={`/users/${props.user.username ?? props.user.id}`}
			key={props.user.id}
			className="flex justify-between items-center bg-grey-800 hover:bg-grey-600 transition-colors p-4 pr-6 rounded-xl"
		>
			<div className="flex gap-4 items-center">
				<p className="text-white w-6 max-sm:w-4 text-center text-lg">
					{props.position}
				</p>
				<div className="flex gap-4 max-sm:gap-2">
					<div className="flex gap-3 max-sm:gap-2 items-center">
						<img
							alt={props.user.name}
							src={props.user.image}
							className="w-8 h-8 rounded-full object-cover bg-white"
						/>
						<p className="text-white text-lg max-sm:max-w-20 truncate whitespace-nowrap">
							{props.user.name}
						</p>
					</div>
					{/* {props.diff !== 0 ? (
						<div
							className={twMerge(
								"flex items-center gap-1",
								props.diff > 0 ? "text-green" : "text-red",
							)}
						>
							{props.diff > 0 ? (
								<CaretUp className="w-4 h-4" weight="fill" />
							) : (
								<CaretDown className="w-4 h-4" weight="fill" />
							)}
							{Math.abs(props.diff)}
						</div>
					) : null} */}
				</div>
			</div>
			<div className="flex gap-8 max-sm:gap-4 items-center">
				{/* {props.gold > 0 ? (
					<div className="flex justify-center gap-1.5 items-center">
						<img
							alt="Gold coin"
							src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
							className="rounded-full h-5 w-5 shadow-xl"
						/>
						<p className="font-semibold text-lg text-[#FEBD1C]">
							{props.gold >= 1000
								? `${(Math.floor(props.gold) / 1000).toFixed(1)}k`
								: Math.floor(props.gold)}
						</p>
					</div>
				) : null} */}
				{/* {props.rank ? (
					<img
						alt={props.rank.name}
						title={props.rank.name}
						className="w-6 h-6 object-contain"
						src={props.rank.image}
					/>
				) : null} */}
				<p className="bg-green text-black/70 font-semibold rounded-md text-sm py-1 px-2">
					LVL {currentLevel}
				</p>
			</div>
		</Link>
	);
}
