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
					Leaderboards
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
								selected={tab === "predictions"}
								onClick={() => setTab("predictions")}
							>
								Predictions
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
										The leaderboard highlights the most engaged participants in
										a community. Earn XP by participating in events, rounds,
										quests, and more.
									</p>
									<div className="flex flex-col gap-2">
										<h3 className="text-white font-semibold">Leveling Up</h3>
										<p>
											XP earned from rounds, quests, predictions, etc. is tied
											to the community it was earned in. Stay active in your
											favorite communities to level up and climb to the top of
											the leaderboard!
										</p>
									</div>
								</div>
							),
							rounds: (
								<div className="flex flex-col gap-4">
									<Card title="Voting">Earn XP for voting in rounds.</Card>
									<Card title="Recieving Votes">
										Proposers earn XP for each vote they recieve.
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
										Quests are a great way to climb the leaderboard fast. Each
										quest completed earns you a certain amount of XP based on
										its difficulty.
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
							// "community-calls": (
							// 	<div className="flex flex-col gap-4">
							// 		<Card title="Attending Community Calls">
							// 			We host a weekly community call each Friday at 2pm CST.
							// 			Attendees are awarded XP for attending the call.
							// 		</Card>
							// 	</div>
							// ),
							shop: (
								<div className="flex flex-col gap-4">
									<Card title="Purchases">
										Players who purchase items from the shop earn XP for every
										dollar you spend.
									</Card>
								</div>
							),
							predictions: (
								<div className="flex flex-col gap-4">
									<Card title="Making Predictions">
										Earn xp once for each prediction you participate in.
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
