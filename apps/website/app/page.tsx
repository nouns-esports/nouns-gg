import Link from "@/components/Link";
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
import { getFeed } from "@/server/queries/farcaster";
import CastCard from "@/components/CastCard";
import CreatePost from "@/components/CreatePost";

export default async function Home() {
	const user = await getAuthenticatedUser();
	const feed = await getFeed({
		channels: ["nouns-esports"],
		viewerFid: user?.farcaster?.fid,
	});
	return (
		<div className="flex flex-col w-full items-center">
			<div className="flex w-full gap-16 mb-16 max-sm:mb-8 max-lg:gap-12 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 max-w-[1920px]">
				<div className="flex flex-col items-center w-full">
					<div className="flex flex-col gap-4 max-w-3xl">
						<div className="flex items-center justify-between">
							<h2 className="text-white text-2xl font-luckiest-guy">
								Latest Discussions
							</h2>
							<CreatePost user={user} communities={[]} />
						</div>
						{feed
							.toSorted((a, b) => {
								return (
									new Date(b.timestamp).getTime() -
									new Date(a.timestamp).getTime()
								);
							})
							.map((cast) => (
								<CastCard
									key={cast.hash}
									cast={cast}
									// @ts-ignore FIX ISSUE LATER
									community={{ id: 7, name: "Nouns", image: "/logo/logo.png" }}
								/>
							))}
					</div>
				</div>
				<aside className="flex flex-col gap-8 w-[500px] flex-shrink-0">
					<Gallery />
					<div className="flex flex-col gap-4">
						<div className="flex justify-between">
							<h2 className="text-white text-2xl font-bebas-neue">
								Trending Communities
							</h2>
							<Link href="/communities">View All</Link>
						</div>
						<ul>
							<li>One</li>
							<li>Two</li>
							<li>Three</li>
							<li>Four</li>
							<li>Five</li>
							<li>Six</li>
							<li>Seven</li>
						</ul>
					</div>
					<div className="flex flex-col gap-4">
						<div className="flex justify-between">
							<h2 className="text-white text-2xl font-bebas-neue">
								Active Rounds
							</h2>
							<Link href="/rounds">View All</Link>
						</div>
						<ul>
							<li>One</li>
							<li>Two</li>
							<li>Three</li>
							<li>Four</li>
							<li>Five</li>
							<li>Six</li>
							<li>Seven</li>
						</ul>
					</div>
				</aside>
			</div>
		</div>
	);
}
