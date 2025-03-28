"use client";

import { Sparkles, X } from "lucide-react";
import { Modal, ToggleModal } from "../Modal";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function RankingSystemExplainer() {
	const [tab, setTab] = useState<string>();
	return (
		<Modal
			id="ranking-system-explainer"
			className="p-4 flex flex-col max-w-[1000px] max-h-[80vh] max-sm:h-full aspect-video max-sm:aspect-auto w-full gap-4"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Ranking System
				</p>
				<ToggleModal
					id="ranking-system-explainer"
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>
			<div className="flex max-sm:flex-col gap-8 max-sm:gap-4 w-full h-full">
				<div className="flex flex-col gap-4 max-sm:gap-2 w-40 flex-shrink-0 max-sm:w-full max-sm:flex-row max-sm:overflow-x-auto max-sm:h-min">
					<Tab selected={!tab} onClick={() => setTab(undefined)}>
						How it works
					</Tab>
					<div className="flex flex-col gap-2 max-sm:w-full max-sm:flex-row">
						<p className="text-white font-bebas-neue text-lg max-sm:hidden">
							Ways to earn XP
						</p>
						<ul className="flex flex-col gap-2 w-full max-sm:flex-row">
							<Tab selected={tab === "rounds"} onClick={() => setTab("rounds")}>
								Rounds
							</Tab>
							<Tab selected={tab === "quests"} onClick={() => setTab("quests")}>
								Quests
							</Tab>
							<Tab
								selected={tab === "farcaster"}
								onClick={() => setTab("farcaster")}
							>
								Farcaster
							</Tab>
							<Tab
								selected={tab === "community-calls"}
								onClick={() => setTab("community-calls")}
							>
								Discord
							</Tab>
							<Tab selected={tab === "shop"} onClick={() => setTab("shop")}>
								Shop
							</Tab>
							<Tab
								selected={tab === "achievements"}
								onClick={() => setTab("achievements")}
							>
								Achievements
							</Tab>
						</ul>
					</div>
				</div>
				<div className="flex flex-col gap-2 w-full overflow-y-auto h-full">
					{
						{
							default: (
								<div className="flex flex-col gap-4 bg-grey-800 rounded-xl p-4 max-sm:mb-10">
									<p>
										The Nexus is a ranking system that highlights rewards the
										most engaged community memebers.
									</p>

									<div className="flex flex-col gap-2">
										<h3 className="text-white font-semibold">
											Weekly Rankings
										</h3>
										<p>
											The leaderboard refreshes every Friday at 1:50 PM CST.
											Each player earns a score based on the total XP they've
											earned during the week, averaged with their score from the
											previous week. This system not only ensures that new
											players can feasibly reach the top, but it also means
											existing players won't immediatly get deranked if they
											miss a week. Stay active to maintain or improve your rank!
										</p>
									</div>

									<div className="flex flex-col gap-2">
										<h3 className="text-white font-semibold">Earning Gold</h3>
										<p>
											Players in the top positions earn gold each week. Gold can
											be used to purchase exclusive items, experiences, and
											merch in the shop. The higher your rank, the more gold
											you'll receive! The value of gold is fixed at 1 Gold =
											$0.01.
										</p>
									</div>

									<div className="flex flex-col gap-2">
										<h3 className="text-white font-semibold">
											Rank Progression
										</h3>
										<p>
											The rank you recieve is based on your positions percentile
											within the leaderboard. There are a total of 9 ranks
											including{" "}
											<span className="text-blue-700 font-semibold">
												Explorer I, II, III
											</span>
											,{" "}
											<span className="text-purple font-semibold">
												Challenger I, II, III
											</span>
											, and{" "}
											<span className="text-red font-semibold">
												Champion I, II, III
											</span>
											. Each rank comes with its own badge that displays next to
											your name on the leaderboard. Higher ranks unlock
											additional perks and recognition within the community.
										</p>
									</div>
								</div>
							),
							rounds: (
								<div className="flex flex-col gap-4">
									<Card title="Voting" xp={50}>
										Earn 50 XP for each vote you cast in a round. Higher ranks
										are allocated more votes, so staying active in rounds can be
										a good way to maintain your rank.
									</Card>
									<Card title="Recieving Votes" xp={5}>
										Proposers recieve 5 XP for each vote someone places on their
										proposal.
									</Card>
									{/* <Card title="Proposing" xp={300}>
										Participate in a round by creating a proposal and earn 300
										XP.
									</Card> */}
								</div>
							),
							quests: (
								<div className="flex flex-col gap-4">
									<Card title="Completing Quests">
										Quests are a great way to climb the ranks fast. Each quest
										completed earns you a certain amount of XP based on its
										difficulty.
									</Card>
								</div>
							),
							farcaster: (
								<div className="flex flex-col gap-4">
									<Card title="Likes Recieved" xp={25}>
										Every like you recieve on a post in the /nouns-esports
										channel within a 24 hour timeframe earns you 25 XP
									</Card>
									<Card title="Reposts Recieved" xp={75}>
										Every repost you recieve on a post in the /nouns-esports
										channel within a 24 hour timeframe earns you 75 XP
									</Card>
								</div>
							),
							"community-calls": (
								<div className="flex flex-col gap-4">
									<Card title="Attending Community Calls" xp={500}>
										We host a weekly community call each Friday at 2pm CST.
										Attendees are awarded 500 XP for attending the call.
									</Card>
								</div>
							),
							shop: (
								<div className="flex flex-col gap-4">
									<Card title="Purchases">
										Players who purchase items from the shop earn 10 XP per
										dollar spent. Any gold discounts applied to the order are
										not included in this calculation.
									</Card>
								</div>
							),
							achievements: (
								<div className="flex flex-col gap-4">
									<Card title="Completing Achievements">
										Earn XP when you reach milestones in your Nexus journey.
									</Card>
								</div>
							),
						}[tab ?? "default"]
					}
				</div>
			</div>
		</Modal>
	);
}

function Tab(props: {
	children: string;
	selected: boolean;
	onClick: () => void;
}) {
	return (
		<div
			onClick={props.onClick}
			className={twMerge(
				"text-grey-200 bg-grey-600 hover:bg-grey-500 transition-colors text-center px-2 py-1 rounded-md font-semibold cursor-pointer whitespace-nowrap",
				props.selected && "bg-red hover:bg-red/70 text-white",
			)}
		>
			{props.children}
		</div>
	);
}

function Card(props: {
	children: string;
	title: string;
	xp?: number;
}) {
	return (
		<div className="flex flex-col gap-2 bg-grey-800 rounded-xl w-full p-4">
			<div className="flex w-full justify-between">
				<p className="text-white font-semibold">{props.title}</p>
				<p className="text-white flex items-center gap-2">
					<Sparkles className="w-4 h-4 text-green" />
					{props.xp ?? "Variable"}
				</p>
			</div>
			<p>{props.children}</p>
		</div>
	);
}
