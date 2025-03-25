import CastCard from "@/components/CastCard";
import { getCommunities } from "@/server/queries/communities";
import { getFeed } from "@/server/queries/farcaster";
import { ArrowLeft } from "lucide-react";
import { getAuthenticatedUser } from "@/server/queries/users";
import CreatePost from "@/components/CreatePost";
import Link from "@/components/Link";
import { twMerge } from "tailwind-merge";

export default async function Chat(props: {
	searchParams: Promise<{ c?: string }>;
}) {
	const searchParams = await props.searchParams;
	const [user, communities] = await Promise.all([
		getAuthenticatedUser(),
		getCommunities({
			ids: ["cs", "dota", "nounsfe", "smash", "rocket-league"],
		}),
	]);

	// const allChannels = [
	// 	...communities.map((c) => c.channel),
	// 	...communities.flatMap((c) => c.children.map((child) => child.channel)),
	// ];

	const community = communities.find((c) => c.id === searchParams?.c);
	// const subChannels = community?.children.map((child) => child.channel);

	const feed = await getFeed({
		//@ts-ignore FIX ISSUE LATER
		channels: community
			? [
					community.channel,
					//...(subChannels ?? [])
				]
			: [
					"nouns-esports",
					//...allChannels
				],
		viewerFid: user?.farcaster?.fid,
	});

	return (
		<div className="flex flex-col items-center w-full pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
			<div className="flex gap-16">
				<div className="flex flex-col gap-8 max-w-3xl w-full">
					<div className="flex flex-col gap-4">
						{community ? (
							<Link
								href="/chat"
								className="text-red flex items-center gap-1 group"
							>
								<ArrowLeft className="w-5 h-5 text-red group-hover:-translate-x-1 transition-transform" />
								All discussion
							</Link>
						) : null}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								{community ? (
									<img
										alt={community.name}
										key={community.image}
										src={community.image}
										className="w-10 h-10 rounded-lg"
									/>
								) : null}
								<h1 className="text-white text-4xl font-luckiest-guy">
									{community?.name ?? "Discussion"}
								</h1>
							</div>
							<CreatePost user={user} communities={communities} />
						</div>
					</div>
					<div className="flex flex-col gap-4">
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
									community={communities.find(
										(c) => c.channel === cast.channel?.id,
									)}
								/>
							))}
					</div>
				</div>
				<div className="flex flex-col gap-2 rounded-xl bg-grey-800 p-4 h-min w-64 sticky top-32">
					<h2 className="text-white text-2xl font-bebas-neue">Communities</h2>
					<div className="flex flex-col gap-1">
						{communities.map((c) => (
							<Link
								key={c.id}
								href={`/chat?c=${c.id}`}
								className={twMerge(
									"flex items-center hover:bg-grey-600 transition-colors gap-2 text-white text-nowrap p-2 rounded-xl",
									searchParams?.c === c.id && "bg-grey-600",
								)}
							>
								<img
									alt={c.name}
									src={c.image}
									className="w-6 h-6 rounded-md"
								/>
								{c.name}
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
