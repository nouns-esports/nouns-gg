import DateComponent from "@/components/Date";
import Link from "@/components/Link";
import PlaceBetModal from "@/components/modals/PlaceBetModal";
import PredictionCard from "@/components/PredictionCard";
import QuestCard from "@/components/QuestCard";
import RoundCard from "@/components/RoundCard";
import { getEvent } from "@/server/queries/events";
import { getAuthenticatedUser } from "@/server/queries/users";
import { CalendarDays, MapPinned } from "lucide-react";
import type { Metadata } from "next";
import { env } from "~/env";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
	params: Promise<{ event: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const event = await getEvent({ id: params.event });

	if (!event) {
		return notFound();
	}

	return {
		title: event.name,
		description: null,
		metadataBase: new URL(env.NEXT_PUBLIC_DOMAIN),
		openGraph: {
			type: "website",
			images: [event.image],
		},
		twitter: {
			site: "@NounsEsports",
			card: "summary_large_image",
			images: [event.image],
		},
		other: {
			"fc:frame": JSON.stringify({
				version: "next",
				imageUrl: event.image,
				button: {
					title: "View Event",
					action: {
						type: "launch_frame",
						name: "Nouns GG",
						url: `${env.NEXT_PUBLIC_DOMAIN}/events/${event.id}`,
						splashImageUrl:
							"https://ipfs.nouns.gg/ipfs/bafkreia2vysupa4ctmftg5ro73igggkq4fzgqjfjqdafntylwlnfclziey",
						splashBackgroundColor: "#040404",
					},
				},
			}),
		},
	};
}

export default async function EventPage(props: {
	params: Promise<{ event: string }>;
}) {
	const params = await props.params;
	const user = await getAuthenticatedUser();

	const event = await getEvent({
		id: params.event,
		user: user?.id,
	});

	if (!event) {
		return notFound();
	}

	return (
		<>
			<div className="flex flex-col gap-16 pt-32 max-xl:pt-28 max-sm:pt-20">
				<div className="px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
					<div className="flex max-lg:flex-col h-60 max-lg:h-auto gap-5 w-full bg-grey-800 rounded-xl p-4">
						<img
							alt={event.name}
							src={event.image}
							className="h-full max-lg:max-h-60 max-sm:w-full max-sm:max-h-none aspect-video rounded-xl object-cover"
						/>
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-between gap-4">
								<h1 className="text-white font-luckiest-guy text-4xl">
									{event.name}
								</h1>
								{event.community ? (
									<Link
										href={`https://warpcast.com/~/channel/${event.community.id ?? "nouns-esports"}`}
										newTab
										className="bg-grey-500 hover:bg-grey-400 transition-colors py-2 pl-2 pr-3 flex-shrink-0 rounded-full flex text-white items-center gap-2 text-sm font-semibold w-fit whitespace-nowrap"
									>
										<img
											alt={event.community.name ?? "Nouns Esports"}
											src={event.community.image ?? "/logo/logo-square.png"}
											className="w-5 h-5 rounded-full"
										/>
										{event.community.name ?? "Nouns Esports"}
									</Link>
								) : null}
							</div>
							<p className="text-grey-200 max-sm:max-h-32 h-full overflow-y-auto custom-scrollbar">
								{event.description}
							</p>
							<div className="flex items-center gap-6">
								<div className="flex items-center gap-2 text-white font-bebas-neue text-xl">
									<CalendarDays className="w-6 h-6 text-white" />
									<p className="mt-0.5">
										<DateComponent timestamp={event.start} short /> -{" "}
										<DateComponent timestamp={event.end} short />
									</p>
								</div>
								<div className="flex items-center gap-2 text-white font-bebas-neue text-xl">
									<MapPinned className="w-6 h-6 text-white" />
									<p className="mt-0.5">{event.location}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* {event.rounds.length > 0 && (
					<div className="flex flex-col gap-6">
						<h2 className="text-white font-luckiest-guy text-3xl pl-32 max-2xl:pl-16 max-xl:pl-8 max-sm:pl-4">
							Rounds
						</h2>
						<div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:flex max-lg:overflow-x-scroll max-lg:scrollbar-hidden gap-4 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
							{event.rounds.map((round) => (
								<RoundCard
									key={round.id}
									id={round.id}
									image={round.image}
									name={round.name}
									start={round.start}
									votingStart={round.votingStart}
									end={round.end}
									community={
										round.community
											? {
													id: round.community.id,
													name: round.community.name,
													image: round.community.image,
												}
											: undefined
									}
									className="max-lg:w-80 max-lg:flex-shrink-0"
								/>
							))}
						</div>
					</div>
				)} */}
				{event.quests.length > 0 && (
					<div className="flex flex-col gap-6">
						<h2 className="text-white font-luckiest-guy text-3xl pl-32 max-2xl:pl-16 max-xl:pl-8 max-sm:pl-4">
							Quests
						</h2>
						<div className="grid grid-cols-5 max-2xl:grid-cols-4 max-lg:flex max-lg:overflow-x-scroll max-lg:scrollbar-hidden gap-4 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
							{event.quests.map((quest) => (
								<QuestCard
									key={quest.id}
									id={quest.id}
									name={quest.name}
									description={quest.description}
									image={quest.image}
									start={quest.start ?? undefined}
									end={quest.end ?? undefined}
									community={
										quest.community
											? {
													id: quest.community.id,
													name: quest.community.name,
													image: quest.community.image,
												}
											: undefined
									}
									xp={quest.xp}
									completed={quest.completed?.length > 0}
									className="max-lg:w-64 max-lg:flex-shrink-0"
								/>
							))}
						</div>
					</div>
				)}
				{event.predictions.length > 0 && (
					<div id="predictions" className="flex flex-col gap-6">
						<h2 className="text-white font-luckiest-guy text-3xl pl-32 max-2xl:pl-16 max-xl:pl-8 max-sm:pl-4">
							Predictions
						</h2>
						<div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-md:flex max-md:flex-col gap-4 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
							{event.predictions.map((prediction) => (
								<PredictionCard
									key={prediction.id}
									id={prediction.id}
									name={prediction.name}
									image={prediction.image}
									xp={prediction.xp}
									outcomes={prediction.outcomes}
									totalBets={prediction.outcomes.reduce(
										(acc, outcome) => acc + outcome.totalBets,
										0,
									)}
									closed={prediction.closed}
									userBet={prediction.bets?.[0]}
									user={user}
									className="max-md:w-full max-md:flex-shrink-0"
								/>
							))}
						</div>
					</div>
				)}
			</div>
			<PlaceBetModal />
		</>
	);
}
