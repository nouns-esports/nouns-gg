import DateComponent from "@/components/Date";
import Link from "@/components/Link";
import QuestCard from "@/components/QuestCard";
import RoundCard from "@/components/RoundCard";
import { getEvent } from "@/server/queries/events";
import { getAuthenticatedUser } from "@/server/queries/users";
import { CalendarDays, MapPinned } from "lucide-react";
import type { Metadata } from "next";
import { env } from "~/env";
import { notFound, redirect } from "next/navigation";
import Button from "@/components/Button";
import { twMerge } from "tailwind-merge";
import ProductCard from "@/components/ProductCard";
import TipTap from "@/components/TipTap";
import { ToggleModal } from "@/components/Modal";
import EventAttendeesModal from "@/components/modals/EventAttendeesModal";
import RaffleCard from "@/components/RaffleCard";
import EnterRaffleModal from "@/components/modals/EnterRaffleModal";
import { getRounds } from "@/server/queries/rounds";
import { getPredictions } from "@/server/queries/predictions";
import { getProducts } from "@/server/queries/shop";
import { getQuests } from "@/server/queries/quests";
import { getRaffles } from "@/server/queries/raffles";
import PredictionCard from "@/components/PredictionCard";
import { isUUID } from "@/utils/isUUID";

export async function generateMetadata(props: {
	params: Promise<{ event: string; community: string }>;
}): Promise<Metadata> {
	const params = await props.params;

	let event: Awaited<ReturnType<typeof getEvent>> | undefined;

	if (isUUID(params.event)) {
		event = await getEvent({ id: params.event });
	} else {
		event = await getEvent({
			handle: params.event,
			community: params.community,
		});
	}

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
						url: `${env.NEXT_PUBLIC_DOMAIN}/events/${event.handle}`,
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
	params: Promise<{ event: string; community: string }>;
	searchParams: Promise<{
		tab?: "rounds" | "quests" | "predictions" | "shop";
	}>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;
	const user = await getAuthenticatedUser();

	let event: Awaited<ReturnType<typeof getEvent>> | undefined;

	if (isUUID(params.event)) {
		event = await getEvent({ id: params.event, user: user?.id });
	} else {
		event = await getEvent({
			handle: params.event,
			community: params.community,
			user: user?.id,
		});
	}

	if (!event) {
		return notFound();
	}

	const tab =
		searchParams.tab ??
		(event.details
			? "details"
			: event.hasRounds
				? "rounds"
				: event.hasQuests
					? "quests"
					: event.hasPredictions
						? "predictions"
						: event.hasShop
							? "shop"
							: null);

	const rounds = tab === "rounds" ? await getRounds({ event: event.id }) : [];
	const quests =
		tab === "quests"
			? await getQuests({ event: event.id, user: user?.id })
			: [];
	const predictions =
		tab === "predictions"
			? await getPredictions({ event: event.id, user: user?.id })
			: [];
	const [products, raffles] =
		tab === "shop"
			? await Promise.all([
					getProducts({ event: event.id }),
					getRaffles({ event: event.id, user: user?.id }),
				])
			: [[], []];

	const attendees = [
		// {
		// 	user: {
		// 		id: "_",
		// 		name: "Mang0",
		// 		image:
		// 			"https://static-cdn.jtvnw.net/jtv_user_pictures/8647bb3a-1e64-4839-987f-6aec0b44a223-profile_image-300x300.png",
		// 		username: "_",
		// 	},
		// },
		// {
		// 	user: {
		// 		id: "_",
		// 		name: "Zain",
		// 		image:
		// 			"https://upload.wikimedia.org/wikipedia/commons/c/c6/Zain_at_Genesis_9.jpg",
		// 		username: "_",
		// 	},
		// },
		// {
		// 	user: {
		// 		id: "_",
		// 		name: "Hungrybox",
		// 		image:
		// 			"https://pbs.twimg.com/profile_images/1891322233504829440/VZZ_pxrO_400x400.jpg",
		// 		username: "_",
		// 	},
		// },
		...event.attendees
			.filter((attendee) => attendee.user !== null)
			.sort((a, b) => {
				if (a.featured && !b.featured) return -1;
				if (!a.featured && b.featured) return 1;
				return 0;
			}),
	];

	return (
		<>
			<div className="flex flex-col items-center w-full">
				<img
					alt={event.name}
					src={event.image}
					className="h-96 max-2xl:h-80 max-xl:h-64 max-lg:h-48 w-full object-cover"
				/>
				<div className="flex flex-col items-center gap-6 max-sm:gap-3 w-full max-w-[1920px]">
					<div className="flex flex-col items-center max-[1920px]:px-0 px-24 w-full">
						<div className="flex flex-col gap-6 w-full bg-grey-800 rounded-b-2xl px-8 max-[1920px]:px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 pt-[20px]">
							<div className="flex gap-32 w-full">
								<div className="flex flex-col gap-4 w-full">
									<div className="flex items-center justify-between gap-4 max-lg:flex-col max-lg:items-start">
										<h1 className="text-white font-luckiest-guy text-4xl max-md:text-3xl">
											{event.name}
										</h1>
										<div className="flex gap-8 h-fit flex-shrink-0 max-lg:justify-between max-lg:w-full">
											{event.attendeeCount && attendees.length > 0 ? (
												<ToggleModal
													id="event-attendees"
													className="flex items-center gap-2 group max-lg:flex-row-reverse max-lg:gap-4"
												>
													<p className="text-white group-hover:text-white/70 transition-colors">
														{event.attendeeCount} Attendees
													</p>
													<div
														className="relative h-10"
														style={{
															width: `${Math.min(attendees.length, 3) * 18 + 18}px`,
														}}
													>
														{attendees.slice(0, 3).map((attendee, index) => (
															<div
																key={
																	attendee.user.id === "_"
																		? `attendee-${index}`
																		: attendee.user.id
																}
																style={{
																	left: `${index * 20}px`,
																}}
																className="absolute w-10 h-10 rounded-full bg-white overflow-hidden border-4 border-grey-800"
															>
																<div className="absolute w-full h-full group-hover:bg-grey-800/50 bg-transparent transition-colors" />
																<img
																	src={attendee.user.image}
																	className="w-full h-full object-cover"
																/>
															</div>
														))}
													</div>
												</ToggleModal>
											) : null}
											{event.callToAction ? (
												<Button
													disabled={event.callToAction.disabled}
													href={event.callToAction.url}
													newTab
												>
													{event.callToAction.label}
												</Button>
											) : null}
										</div>
									</div>

									<div className="flex flex-col gap-6 w-full">
										<p className="text-grey-200 max-sm:max-h-32 h-full overflow-y-auto custom-scrollbar">
											{event.description}
										</p>
										<div className="flex items-center gap-6 overflow-x-auto w-full flex-shrink-0 max-w-full">
											{event.community ? (
												<Link
													href={`/c/${event.community.handle}`}
													className="bg-grey-500 hover:bg-grey-400 transition-colors py-2 pl-2 pr-3 flex-shrink-0 rounded-full flex text-white items-center gap-2 text-sm font-semibold w-fit whitespace-nowrap"
												>
													<img
														alt={event.community.name}
														src={event.community.image}
														className="w-5 h-5 rounded-full"
													/>
													{event.community.name}
												</Link>
											) : null}
											<div className="flex items-center gap-2 text-white flex-shrink-0">
												<CalendarDays className="w-5 h-5 text-white" />
												<p className="mt-0.5 whitespace-nowrap">
													{new Date(event.start).getFullYear() ===
														new Date(event.end).getFullYear() &&
													new Date(event.start).getMonth() ===
														new Date(event.end).getMonth() &&
													new Date(event.start).getDate() ===
														new Date(event.end).getDate() ? (
														<DateComponent
															timestamp={event.start}
															format="%monthShort %day%ordinal, %year"
														/>
													) : (
														<>
															<DateComponent
																timestamp={event.start}
																format="%monthShort %day%ordinal, %year"
															/>
															{" - "}
															<DateComponent
																timestamp={event.end}
																format="%monthShort %day%ordinal, %year"
															/>
														</>
													)}
												</p>
											</div>
											{event.location ? (
												<Link
													// @ts-ignore
													href={event.location.url}
													newTab
													className="flex items-center gap-2 text-white group flex-shrink-0"
												>
													<MapPinned className="w-5 h-5 group-hover:text-white/70 transition-colors" />
													<p className="mt-0.5 whitespace-nowrap group-hover:text-white/70 transition-colors">
														{event.location.name}
													</p>
												</Link>
											) : null}
										</div>
									</div>
								</div>
							</div>
							{tab ? (
								<ul className="flex gap-2 w-full overflow-x-auto">
									{event.details ? (
										<Tab
											href={`/events/${event.handle}`}
											active={tab === "details"}
										>
											Details
										</Tab>
									) : null}
									{event.hasRounds ? (
										<Tab href="?tab=rounds" active={tab === "rounds"}>
											Rounds
										</Tab>
									) : null}
									{event.hasQuests ? (
										<Tab href="?tab=quests" active={tab === "quests"}>
											Quests
										</Tab>
									) : null}
									{event.hasPredictions ? (
										<Tab href="?tab=predictions" active={tab === "predictions"}>
											Predictions
										</Tab>
									) : null}
									{event.hasShop ? (
										<Tab href="?tab=shop" active={tab === "shop"}>
											Shop
										</Tab>
									) : null}
								</ul>
							) : null}
						</div>
					</div>
					<div className="flex flex-col gap-8 w-full max-w-[1920px] px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
						{
							{
								details: (
									<div className="w-full flex justify-center">
										{event.details ? (
											<TipTap
												content={event.details}
												className="bg-grey-800 rounded-xl px-6 py-5 max-sm:px-4 max-sm:py-3 max-w-screen-lg"
											/>
										) : null}
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
			<EventAttendeesModal attendees={attendees} />
			{raffles.map((raffle) => {
				return (
					<EnterRaffleModal
						key={raffle.id}
						availableGold={user?.gold ?? 0}
						raffle={raffle}
					/>
				);
			})}
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
