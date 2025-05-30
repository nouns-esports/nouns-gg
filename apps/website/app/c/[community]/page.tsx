import Link from "@/components/Link";
import { notFound } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { getCommunity } from "@/server/queries/communities";
import QuestCard from "@/components/QuestCard";
import RoundCard from "@/components/RoundCard";
import { getRounds } from "@/server/queries/rounds";
import { getQuests } from "@/server/queries/quests";
import { getPredictions } from "@/server/queries/predictions";
import { getAuthenticatedUser } from "@/server/queries/users";
import EventCard from "@/components/EventCard";
import { getEvents } from "@/server/queries/events";
import PredictionCard from "@/components/PredictionCard";
import { getLeaderboard, getRank } from "@/server/queries/leaderboard";
import { level } from "@/utils/level";
import { ToggleModal } from "@/components/Modal";
import { Info } from "lucide-react";
import RankingSystemExplainer from "@/components/modals/RankingSystemExplainer";
import TipTap from "@/components/TipTap";
import { getProducts } from "@/server/queries/shop";
import ProductCard from "@/components/ProductCard";
import { getRaffles } from "@/server/queries/raffles";
import RaffleCard from "@/components/RaffleCard";

export default async function Community(props: {
	params: Promise<{ community: string }>;
	searchParams: Promise<{
		tab?: "rounds" | "quests" | "predictions";
	}>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;

	const [community, user] = await Promise.all([
		getCommunity({ handle: params.community }),
		getAuthenticatedUser(),
	]);

	if (!community) {
		return notFound();
	}

	const tab =
		searchParams.tab ??
		(community.details
			? "details"
			: community.hasEvents
				? "events"
				: community.hasRounds
					? "rounds"
					: community.hasQuests
						? "quests"
						: community.hasPredictions
							? "predictions"
							: community.hasLeaderboard
								? "leaderboard"
								: community.hasShop
									? "shop"
									: null);

	const [
		rounds,
		quests,
		predictions,
		events,
		leaderboard,
		userPosition,
		products,
		raffles,
	] = await Promise.all([
		tab === "rounds" ? getRounds({ community: community.id }) : [],
		tab === "quests"
			? getQuests({ community: community.id, user: user?.id })
			: [],
		tab === "predictions"
			? getPredictions({ community: community.id, user: user?.id, limit: 40 })
			: [],
		tab === "events" ? getEvents({ community: community.id }) : [],
		tab === "leaderboard" ? getLeaderboard({ community: community.id }) : [],
		tab === "leaderboard" && user
			? getRank({ user: user.id, community: community.id })
			: undefined,
		tab === "shop" ? getProducts({ community: community.id }) : [],
		tab === "shop" ? getRaffles({ community: community.id }) : [],
	]);

	return (
		<>
			<div className="flex flex-col w-full items-center">
				<div className="relative flex flex-col justify-center gap-8 w-full pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 max-w-[1920px]">
					<div className="px-4 pt-4 flex flex-col gap-4 bg-grey-800 rounded-xl">
						<div className="flex items-center gap-4">
							<img
								src={community.image}
								alt={community.name}
								className=" h-12 w-12 object-cover object-center rounded-md"
							/>
							<h1 className="text-white text-2xl font-luckiest-guy">
								{community.name}
							</h1>
						</div>
						{tab ? (
							<ul className="flex gap-2 w-full overflow-x-auto">
								{community.details ? (
									<Tab
										href={`/c/${community.handle}`}
										active={tab === "details"}
									>
										Details
									</Tab>
								) : null}
								{community.hasRounds ? (
									<Tab href="?tab=rounds" active={tab === "rounds"}>
										Rounds
									</Tab>
								) : null}
								{community.hasQuests ? (
									<Tab href="?tab=quests" active={tab === "quests"}>
										Quests
									</Tab>
								) : null}
								{community.hasPredictions ? (
									<Tab href="?tab=predictions" active={tab === "predictions"}>
										Predictions
									</Tab>
								) : null}
								{community.hasEvents ? (
									<Tab href="?tab=events" active={tab === "events"}>
										Events
									</Tab>
								) : null}
								{community.hasLeaderboard ? (
									<Tab href="?tab=leaderboard" active={tab === "leaderboard"}>
										Leaderboard
									</Tab>
								) : null}
								{community.hasShop ? (
									<Tab href="?tab=shop" active={tab === "shop"}>
										Shop
									</Tab>
								) : null}
							</ul>
						) : null}
					</div>
					<div className="flex flex-col gap-8 w-full">
						{
							{
								details: (
									<div className="w-full flex justify-center">
										{community.details ? (
											<TipTap
												content={community.details}
												className="bg-grey-800 rounded-xl px-6 py-5 max-sm:px-4 max-sm:py-3 max-w-screen-lg"
											/>
										) : null}
									</div>
								),
								events: (
									<div className="grid grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1  gap-4">
										{events.map((event) => (
											<EventCard key={`event-${event.id}`} event={event} />
										))}
									</div>
								),
								rounds: (
									<div className="grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
										{rounds.map((round) => (
											<RoundCard key={`round-${round.id}`} round={round} />
										))}
									</div>
								),
								quests: (
									<div className="grid grid-cols-5 max-2xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
										{quests.map((quest) => (
											<QuestCard key={`quest-${quest.id}`} quest={quest} />
										))}
									</div>
								),
								predictions: (
									<div className="flex flex-col gap-6">
										<h2 className="text-white font-luckiest-guy text-2xl">
											Happening Now
										</h2>
										<div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-md:flex max-md:flex-col gap-4">
											{predictions.map((prediction) => (
												<PredictionCard
													key={`prediction-${prediction.id}`}
													prediction={prediction}
													className="max-md:w-full max-md:flex-shrink-0"
												/>
											))}
										</div>
									</div>
								),
								leaderboard: (
									<div className="flex flex-col items-center gap-4">
										<div className="relative flex flex-col gap-8 max-w-2xl w-full">
											{userPosition ? (
												<div className="flex flex-col gap-2">
													<p className="text-white text-lg font-semibold">
														Your Position
													</p>
													<LeaderboardPosition
														key={userPosition.user.id}
														position={userPosition.rank}
														ranking={userPosition}
													/>
												</div>
											) : null}
											<div className="flex flex-col gap-2">
												<div className="flex gap-2 items-center justify-between">
													<p className="text-white text-lg font-semibold">
														All Time
													</p>
													<ToggleModal
														id="ranking-system-explainer"
														className="flex items-center gap-1.5 text-red hover:text-red/70 transition-colors"
													>
														<Info className="w-4 h-4" />
														How do I earn XP?
													</ToggleModal>
												</div>
												{leaderboard.map((ranking, index) => {
													const position = index + 1;

													return (
														<LeaderboardPosition
															key={ranking.user.id}
															position={position}
															ranking={ranking}
														/>
													);
												})}
											</div>
										</div>
									</div>
								),
								shop: (
									<div className="flex flex-col gap-6">
										{raffles.length > 0 ? (
											<div className="flex flex-col gap-4">
												<h2 className="text-white font-luckiest-guy text-2xl">
													Raffles
												</h2>
												<div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-md:flex max-md:flex-col gap-4">
													{raffles.map((raffle) => {
														return (
															<RaffleCard key={raffle.id} raffle={raffle} />
														);
													})}
												</div>
											</div>
										) : null}
										{products.length > 0 ? (
											<div className="flex flex-col gap-4">
												<h2 className="text-white font-luckiest-guy text-2xl">
													Products
												</h2>
												<div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-md:flex max-md:flex-col gap-4">
													{products.map((product) => {
														return (
															<ProductCard key={product.id} product={product} />
														);
													})}
												</div>
											</div>
										) : null}
									</div>
								),
								default: null,
							}[tab ?? "default"]
						}
					</div>
				</div>
			</div>
			{tab === "leaderboard" ? <RankingSystemExplainer /> : null}
		</>
	);
}

function Tab(props: { children: string; active: boolean; href: string }) {
	return (
		<li
			className={twMerge(
				"relative text-white font-bebas-neue px-3 text-xl hover:bg-grey-500 rounded-t-md transition-colors py-1",
				props.active && "text-red",
			)}
		>
			<Link href={props.href}>{props.children}</Link>
			{props.active ? (
				<div className="w-full h-0.5 bg-red absolute bottom-0 left-0" />
			) : null}
		</li>
	);
}

function LeaderboardPosition(props: {
	ranking: NonNullable<Awaited<ReturnType<typeof getLeaderboard>>>[number];
	position: number;
}) {
	const { currentLevel } = level(props.ranking.xp);

	return (
		<Link
			href={`/users/${props.ranking.user.id}`}
			key={props.ranking.user.id}
			className="flex justify-between items-center bg-grey-800 hover:bg-grey-600 transition-colors p-4 pr-6 rounded-xl"
		>
			<div className="flex gap-4 items-center">
				<p className="text-white w-6 max-sm:w-4 text-center text-lg">
					{props.position}
				</p>
				<div className="flex gap-4 max-sm:gap-2">
					<div className="flex gap-3 max-sm:gap-2 items-center">
						<img
							alt={props.ranking.user.id}
							src={props.ranking.user?.image ?? ""}
							className="w-8 h-8 rounded-full object-cover bg-white"
						/>
						<p className="text-white text-lg max-sm:max-w-20 truncate whitespace-nowrap">
							{props.ranking.user.name}
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
				<p className="bg-green text-black/70 font-semibold rounded-md text-sm py-1 px-2">
					LVL {currentLevel}
				</p>
			</div>
		</Link>
	);
}
