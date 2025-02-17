import Link from "@/components/Link";
import {
	getLeaderboard,
	getLeaderboardPosition,
} from "@/server/queries/rankings";
import { getAuthenticatedUser } from "@/server/queries/users";
import { CaretUp, CaretDown } from "phosphor-react-sc";
import Countdown from "@/components/Countdown";
import { twMerge } from "tailwind-merge";
import { ToggleModal } from "@/components/Modal";
import { Image } from "lucide-react";
import ShareRankingModal from "@/components/modals/ShareRankingModal";
import { nextFriday } from "date-fns";
import { env } from "~/env";
import type { Metadata } from "next";

export async function generateMetadata(props: {
	searchParams: Promise<{
		user?: string;
	}>;
}): Promise<Metadata> {
	const searchParams = await props.searchParams;

	if (!searchParams.user) return {};

	return {
		other: {
			"fc:frame": JSON.stringify({
				version: "next",
				imageUrl: `${env.NEXT_PUBLIC_DOMAIN}/api/images/rankings?user=${searchParams.user}`,
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

	const [leaderboard, userPosition] = await Promise.all([
		getLeaderboard(),
		user
			? getLeaderboardPosition({
					user: user.id,
				})
			: undefined,
	]);

	return (
		<>
			<div className="flex flex-col items-center gap-16 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
				<div className="flex flex-col w-full max-w-screen-md gap-8 p-4">
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
						<div className="flex flex-col items-center bg-grey-800 rounded-xl p-2 px-4 gap-2 max-sm:flex-row">
							<h2 className="text-nowrap text-red flex items-center gap-1.5">
								<div className="w-2 h-2 bg-red rounded-full animate-pulse" />
								Updates in
							</h2>
							<div className="flex items-center gap-2 text-nowrap">
								<p className="text-white">
									<Countdown date={nextFriday(new Date())} />
								</p>
							</div>
						</div>
					</div>
					{userPosition ? (
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 justify-between items-center">
								<p className="text-white text-lg font-semibold">
									Your position
								</p>
								<ToggleModal
									id="share-ranking"
									className="flex items-center gap-1.5 text-red"
								>
									<Image className="w-4 h-4" />
									View Image
								</ToggleModal>
							</div>

							<LeaderboardPosition
								position={userPosition.position}
								user={userPosition.user}
								rank={userPosition.rank}
								gold={Number(userPosition.gold?.amount) ?? 0}
								diff={userPosition.previousPosition - userPosition.position}
							/>
						</div>
					) : null}

					<div className="relative flex flex-col gap-2">
						<p className="text-white text-lg font-semibold">This Week</p>
						{leaderboard.map((ranking, index) => {
							if (!ranking.user) return;

							const position = index + 1;

							return (
								<LeaderboardPosition
									key={ranking.id}
									position={position}
									user={ranking.user}
									rank={ranking.rank}
									gold={Number(ranking.gold?.amount) ?? 0}
									diff={ranking.previousPosition - position}
								/>
							);
						})}
					</div>
				</div>
			</div>
			{userPosition ? <ShareRankingModal ranking={userPosition} /> : null}
		</>
	);
}

function LeaderboardPosition(props: {
	position: number;
	user: {
		id: string;
		username: string | null;
		name: string;
		image: string;
	};
	rank: {
		id: number;
		name: string;
		image: string;
	} | null;
	gold: number;
	diff: number;
}) {
	return (
		<Link
			href={`/users/${props.user.username ?? props.user.id}`}
			key={props.user.id}
			className="flex justify-between items-center bg-grey-800 hover:bg-grey-600 transition-colors p-4 pr-6 rounded-xl"
		>
			<div className="flex gap-4 items-center">
				<p className="text-white w-6 text-center text-lg">{props.position}</p>
				<div className="flex gap-3 items-center">
					<img
						alt={props.user.name}
						src={props.user.image}
						className="w-8 h-8 rounded-full object-cover"
					/>
					<p className="text-white text-lg">{props.user.name}</p>
				</div>
				{props.diff !== 0 ? (
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
				) : null}
			</div>
			<div className="flex gap-8 items-center">
				{props.gold > 0 ? (
					<div className="flex justify-center gap-1.5 items-center">
						<img
							alt="Gold coin"
							src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
							className="rounded-full h-5 w-5 shadow-xl"
						/>
						<p className="font-semibold text-lg text-[#FEBD1C]">
							{Math.floor(props.gold)}
						</p>
					</div>
				) : null}
				{props.rank ? (
					<img
						alt={props.rank.name}
						title={props.rank.name}
						className="w-6 h-6 object-contain"
						src={props.rank.image}
					/>
				) : null}
			</div>
		</Link>
	);
}
