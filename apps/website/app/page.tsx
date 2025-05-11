import Link from "@/components/Link";
import Gallery from "@/components/Gallery";
import { ArrowRight } from "lucide-react";
import { getRounds } from "@/server/queries/rounds";
import { getAuthenticatedUser } from "@/server/queries/users";
import CreatePost from "@/components/CreatePost";
import { getPosts } from "@/server/queries/posts";
import PostCard from "@/components/PostCard";
import { getCommunities } from "@/server/queries/communities";
import Feed from "@/components/Feed";
import { getQuests } from "@/server/queries/quests";
import { getPredictions } from "@/server/queries/predictions";
import { getEvents } from "@/server/queries/events";

export default async function Home() {
	const [user, posts, rounds, communities, quests] = await Promise.all([
		getAuthenticatedUser(),
		getPosts(),
		getRounds({ limit: 4 }),
		getCommunities({ featured: true, limit: 4 }),
		getQuests({ limit: 4 }),
	]);
	// const predictions = await getPredictions({ limit: 5 });
	// const events = await getEvents({ limit: 5 });

	return (
		<div className="flex flex-col w-full items-center">
			<div className="flex w-full gap-16 mb-16 max-sm:mb-8 max-lg:gap-12 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 max-w-[1920px]">
				<div className="flex flex-col items-center w-full">
					<Feed
						user={user}
						posts={posts as any}
						// rounds={rounds}
						// quests={quests}
						// predictions={predictions}
						// events={events}
					/>
				</div>
				<aside className="flex flex-col gap-4 w-[400px] flex-shrink-0 max-lg:hidden">
					<Gallery />
					<div className="flex flex-col gap-4 bg-grey-800 py-3 px-4 rounded-xl">
						<div className="flex justify-between">
							<h2 className="text-white text-2xl font-bebas-neue">
								Trending Communities
							</h2>
							<Link
								href="/communities"
								className="text-red group hover:text-red/70 transition-colors flex items-center gap-1"
							>
								View All
								<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
							</Link>
						</div>
						<ul className="flex flex-col gap-3">
							{communities.map((community) => (
								<Link href={`/c/${community.handle}`} key={community.id}>
									<li className="flex items-center gap-2 text-white hover:text-white/70 transition-colors">
										<img
											src={community.image}
											alt={community.name}
											className="w-6 h-6 rounded-md"
										/>
										{community.name}
									</li>
								</Link>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-4 bg-grey-800 py-3 px-4 rounded-xl">
						<div className="flex justify-between">
							<h2 className="text-white text-2xl font-bebas-neue">
								Latest Rounds
							</h2>
							<Link
								href="/rounds"
								className="text-red group hover:text-red/70 transition-colors flex items-center gap-1"
							>
								View All
								<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
							</Link>
						</div>
						<ul className="flex flex-col gap-3">
							{rounds.map((round) => (
								<Link href={`/rounds/${round.handle}`} key={round.id}>
									<li className="flex items-center gap-2 text-white hover:text-white/70 transition-colors">
										<img
											src={round.image}
											alt={round.name}
											className="w-6 h-6 rounded-md"
										/>
										{round.name}
									</li>
								</Link>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-4 bg-grey-800 py-3 px-4 rounded-xl">
						<div className="flex justify-between">
							<h2 className="text-white text-2xl font-bebas-neue">
								Featured Quests
							</h2>
							<Link
								href="/quests"
								className="text-red group hover:text-red/70 transition-colors flex items-center gap-1"
							>
								View All
								<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
							</Link>
						</div>
						<ul className="flex flex-col gap-3">
							{quests.map((quest) => (
								<Link href={`/quests/${quest.handle}`} key={quest.id}>
									<li className="flex items-center gap-2 text-white hover:text-white/70 transition-colors">
										<img
											src={quest.image}
											alt={quest.name}
											className="w-6 h-6 rounded-md"
										/>
										{quest.name}
									</li>
								</Link>
							))}
						</ul>
					</div>
					<div className="flex gap-4 items-center text-sm px-4 text-grey-400">
						<Link href="/discord">Support</Link>
						<Link href="/discord">Discord</Link>
					</div>
				</aside>
			</div>
		</div>
	);
}
