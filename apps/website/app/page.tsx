import Link from "@/components/Link";
import Image from "next/image";
import Gallery from "@/components/Gallery";
import { getTrendingPosts } from "@/server/queries/discussion";
import { ArrowRight, ChevronUp } from "lucide-react";
import { getRounds } from "@/server/queries/rounds";
import RoundCard from "@/components/RoundCard";
import { getAuthenticatedUser } from "@/server/queries/users";
import { getEvents } from "@/server/queries/events";
import { getQuests } from "@/server/queries/quests";
import QuestCard from "@/components/QuestCard";
import EventCard from "@/components/EventCard";

export default async function Home() {
	const [user, trendingPosts, rounds, events] = await Promise.all([
		getAuthenticatedUser(),
		getTrendingPosts(),
		getRounds({ limit: 4 }),
		getEvents({ limit: 3 }),
	]);

	const quests = await getQuests({
		limit: 5,
		user: user?.id,
	});

	const highlightedRound = rounds.find((round) => round.featured);

	const highlightedEvent = events.find((event) => event.featured);

	return (
		<div className="flex flex-col w-full items-center">
			<div className="flex flex-col w-full gap-16 mb-16 max-sm:mb-8 max-lg:gap-12 pt-32 max-xl:pt-28 max-sm:pt-20 max-w-[1920px]">
				<div className="flex gap-4 h-[30vw] max-h-[600px] max-lg:h-auto max-lg:max-h-none w-full px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 max-lg:flex-col">
					<Gallery
						highlightedRound={highlightedRound}
						highlightedEvent={highlightedEvent}
					/>
					<div className="flex flex-col gap-2 bg-gradient-to-b from-[#8A63D2] to-[#473072] rounded-xl overflow-hidden w-full h-full max-lg:hidden">
						<div className="flex items-center justify-between px-4 pt-3">
							<div className="flex items-center text-2xl font-luckiest-guy gap-3 text-white ">
								<img
									alt="Farcaster logo"
									src="/farcaster.svg"
									draggable={false}
									className="w-6 h-6 select-none"
								/>
								Discussion
							</div>
							<Link
								href="https://warpcast.com/~/channel/nouns-esports"
								className="flex text-white font-semibold gap-1 items-center group hover:opacity-70 transition-opacity"
							>
								View All
								<ArrowRight className="w-[1.15rem] h-[1.15rem] group-hover:translate-x-1 transition-transform" />
							</Link>
						</div>
						<ul className="relative flex flex-col h-full overflow-hidden px-2">
							{trendingPosts.map((post) => (
								<li key={post.hash}>
									<Link
										newTab
										href={`https://warpcast.com/${post.author.username}/${post.hash.substring(0, 10)}`}
										className="flex justify-between w-full h-14 hover:bg-black/10 transition-colors rounded-xl pl-2 py-2 pr-4"
									>
										<div className="flex gap-2">
											<img
												src={post.author.pfp_url}
												alt={post.author.display_name}
												className="h-full aspect-square object-cover rounded-full"
											/>
											<div className="flex flex-col h-full w-full">
												<p className="text-white font-semibold text-sm">
													{post.author.display_name}
												</p>
												<p className="text-white text-sm overflow-hidden">
													{post.text}
												</p>
											</div>
										</div>
										<div className="flex gap-1 items-center text-white">
											<ChevronUp className="w-5 h-5" />
											{post.reactions.likes_count}
										</div>
									</Link>
								</li>
							))}
							<div className="-mx-2 from-transparent to-[#473072] bg-gradient-to-b h-16 w-full bottom-0 absolute pointer-events-none" />
						</ul>
					</div>
				</div>
				<div className="flex flex-col gap-4 px-32 max-2xl:px-16 max-xl:px-0">
					<div className="flex justify-between items-center max-xl:px-8 max-sm:px-4">
						<h2 className="font-luckiest-guy text-white text-4xl max-sm:text-3xl">
							Rounds
						</h2>
						<Link
							href="/rounds"
							className="text-red flex gap-1 items-center group"
						>
							View All
							<ArrowRight className="w-[1.15rem] h-[1.15rem] group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
					<div className="flex gap-4 justify-between max-xl:w-full max-xl:overflow-x-scroll max-xl:px-8 max-sm:px-4 max-xl:scrollbar-hidden">
						{rounds.map((round) => (
							<RoundCard
								key={`round-${round.id}`}
								round={round}
								className="max-xl:w-80 max-xl:flex-shrink-0"
							/>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-4 px-32 max-2xl:px-16 max-xl:px-0">
					<div className="flex justify-between items-center max-xl:px-8 max-sm:px-4">
						<h2 className="font-luckiest-guy text-white text-4xl max-sm:text-3xl">
							Quests
						</h2>
						<Link
							href="/quests"
							className="text-red flex gap-1 items-center group"
						>
							View All
							<ArrowRight className="w-[1.15rem] h-[1.15rem] group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
					<div className="flex gap-4 justify-between max-xl:w-full max-xl:overflow-x-scroll max-xl:px-8 max-sm:px-4 max-xl:scrollbar-hidden">
						{quests.map((quest) => (
							<QuestCard
								key={`quest-${quest.id}`}
								quest={quest}
								className="max-xl:w-64 max-xl:flex-shrink-0"
							/>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-4 px-32 max-2xl:px-16 max-xl:px-8 max-lg:px-0">
					<div className="flex justify-between items-center max-lg:px-8 max-sm:px-4">
						<h2 className="font-luckiest-guy text-white text-4xl max-sm:text-3xl">
							Events
						</h2>
						<Link
							href="/events"
							className="text-red flex gap-1 items-center group"
						>
							View All
							<ArrowRight className="w-[1.15rem] h-[1.15rem] group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
					<div className="flex gap-4 justify-between max-lg:w-full max-lg:overflow-x-scroll max-lg:px-8 max-sm:px-4 max-lg:scrollbar-hidden">
						{events.map((event) => (
							<EventCard
								key={`event-${event.id}`}
								event={event}
								className="max-xl:w-96 max-xl:h-auto max-xl:flex-shrink-0"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
