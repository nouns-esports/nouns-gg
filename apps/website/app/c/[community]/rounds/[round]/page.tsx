import Link from "@/components/Link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "phosphor-react-sc";
import Proposals from "@/components/proposals/Proposals";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";
import type { Metadata } from "next";
import { getRound } from "@/server/queries/rounds";
import { getPriorVotes } from "@/server/queries/votes";
import { numberToOrdinal } from "@/utils/numberToOrdinal";
import { getAuthenticatedUser } from "@/server/queries/users";
import { env } from "~/env";
import RoundTimeline from "@/components/RoundTimeline";
import Countup from "@/components/Countup";
import { Gavel, Megaphone, TicketCheck, Users } from "lucide-react";
import Markdown from "@/components/lexical/Markdown";
import NavigateBack from "@/components/NavigateBack";
import { getAction } from "@/server/actions";
import RoundActionsModal from "@/components/modals/RoundActionsModal";
import { db } from "~/packages/db";
import { nounsvitationalVotes, snapshots } from "~/packages/db/schema/public";
import { and, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { isUUID } from "@/utils/isUUID";

export async function generateMetadata(props: {
	params: Promise<{ round: string; community: string }>;
	searchParams: Promise<{ user?: string; p?: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const searchParams = await props.searchParams;

	let round: Awaited<ReturnType<typeof getRound>> | undefined;

	if (isUUID(params.round)) {
		round = await getRound({ id: params.round });
	} else {
		round = await getRound({
			handle: params.round,
			community: params.community,
		});
	}

	if (!round) {
		return notFound();
	}

	const proposal = searchParams.p
		? round.proposals.find((p) => p.id === searchParams.p)
		: undefined;

	const image = searchParams.user
		? `${env.NEXT_PUBLIC_DOMAIN}/api/images/votes?user=${searchParams.user}&round=${round.handle}`
		: proposal?.image
			? proposal.image
			: round.image;

	return {
		title: proposal?.title ?? round.name,
		description: null,
		metadataBase: new URL(env.NEXT_PUBLIC_DOMAIN),
		openGraph: {
			type: "website",
			images: [image],
		},
		twitter: {
			site: "@NounsEsports",
			card: "summary_large_image",
			images: [image],
		},
		other: {
			"fc:frame": JSON.stringify({
				version: "next",
				imageUrl: image,
				button: {
					title: "View Round",
					action: {
						type: "launch_frame",
						name: "Nouns GG",
						url: `${env.NEXT_PUBLIC_DOMAIN}/rounds/${round.handle}`,
						splashImageUrl:
							"https://ipfs.nouns.gg/ipfs/bafkreia2vysupa4ctmftg5ro73igggkq4fzgqjfjqdafntylwlnfclziey",
						splashBackgroundColor: "#040404",
					},
				},
			}),
		},
	};
}

type Activity = {
	timestamp: Date;
} & (
	| {
			type: "state";
			name: string;
			icon: React.ReactNode;
			color: string;
	  }
	| {
			type: "comment";
			url: string;
			user: {
				id: string;
				name: string;
				image: string;
			};
			text: string;
	  }
	| {
			type: "proposal";
			user: {
				id: string;
				name: string;
				image: string;
			};
	  }
	| {
			type: "vote";
			count: number;
			user: {
				id: string;
				name: string;
				image: string;
			};
			for: {
				user: {
					id: string;
					name: string;
					image: string;
				};
				title: string;
			};
	  }
);

export default async function Round(props: {
	params: Promise<{ round: string; community: string }>;
	searchParams: Promise<{ p?: string }>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;

	const user = await getAuthenticatedUser();

	let round: Awaited<ReturnType<typeof getRound>> | undefined;

	if (isUUID(params.round)) {
		round = await getRound({ id: params.round });
	} else {
		round = await getRound({
			handle: params.round,
			community: params.community,
		});
	}

	if (!round) {
		return notFound();
	}

	const priorVotes = user
		? await getPriorVotes({
				user: user.id,
				round: round.id,
			})
		: 0;

	const proposalActivity = round.proposals
		.filter((proposal) => proposal.user)
		.map((proposal) => ({
			type: "proposal",
			timestamp: new Date(proposal.createdAt),
			user: {
				id: proposal.user.id,
				name: proposal.user.name,
				image: proposal.user.image,
			},
		})) satisfies Activity[];

	const voteActivity = round.votes
		.filter((vote) => vote.user && vote.proposal.user)
		.map((vote) => ({
			type: "vote",
			count: vote.count,
			timestamp: new Date(vote.timestamp),
			user: {
				id: vote.user.id,
				name: vote.user.name,
				image: vote.user.image,
			},
			for: {
				title: vote.proposal.title,
				user: {
					id: vote.proposal.user.id,
					name: vote.proposal.user.name,
					image: vote.proposal.user.image,
				},
			},
		})) satisfies Activity[];

	const proposingActions = user
		? await Promise.all(
				round.actions
					.filter((action) => action.type === "proposing")
					.map(async (actionState) => {
						const action = getAction({ action: actionState.action });

						if (!action) {
							throw new Error(`Action ${actionState.action} not found`);
						}

						return {
							...actionState,
							completed: await action.check({
								user: user,
								inputs: actionState.input,
							}),
						};
					}),
			)
		: [];

	let extraActionVotes = 0;

	const votingActions = user
		? await Promise.all(
				round.actions
					.filter((action) => action.type === "voting")
					.map(async (actionState) => {
						const action = getAction({ action: actionState.action });

						if (!action) {
							throw new Error(`Action ${actionState.action} not found`);
						}

						const completed = await action.check({
							user: user,
							inputs: actionState.input,
						});

						if (completed) {
							extraActionVotes = extraActionVotes + actionState.votes;
						}

						return {
							...actionState,
							completed,
						};
					}),
			)
		: [];

	const requiredProposingActions = proposingActions.filter(
		(action) => action.required,
	);
	const requiredVotingActions = votingActions.filter(
		(action) => action.required,
	);

	const lilnounVotes =
		round.community?.handle === "lilnouns" && user && user.wallets.length > 0
			? await (async () => {
					let votes = 0;
					for (const wallet of user.wallets) {
						const snapshot = await db.pgpool.query.snapshots.findFirst({
							where: and(
								eq(snapshots.type, "lilnouns-software"),
								ilike(snapshots.tag, `${wallet.address.toLowerCase()}:%`),
							),
						});

						if (snapshot) {
							votes = votes + Number(snapshot.tag?.split(":")[1] ?? 0);
						}
					}
					return votes;
				})()
			: 0;

	const japanExtraVotes =
		round.handle === "japan-round-1" && user
			? ((
					await db.primary.query.nounsvitationalVotes.findFirst({
						where: eq(nounsvitationalVotes.user, user.id),
					})
				)?.count ?? 0)
			: 0;

	return (
		<>
			<div className="flex flex-col w-full items-center">
				<div className="relative flex flex-col justify-center gap-4 w-full pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 max-w-[1920px]">
					<NavigateBack
						fallback={round.event ? `/events/${round.event.handle}` : "/rounds"}
						className="text-red flex items-center gap-1 group"
					>
						<ArrowLeft className="w-5 h-5 text-red group-hover:-translate-x-1 transition-transform" />
						Back
					</NavigateBack>
					<div className="flex flex-col gap-8">
						<div className="flex gap-4 h-[500px] max-xl:flex-col max-xl:h-auto">
							<div className="bg-grey-800 flex flex-col w-full h-full rounded-xl overflow-hidden max-lg:max-h-[600px] max-sm:max-h-[500px]">
								<img
									alt={round.name}
									src={`${round.image}?img-height=500&img-onerror=redirect`}
									className="w-full h-48 object-cover object-center max-sm:h-32"
								/>
								<div className="flex flex-col h-full gap-2 max-sm:gap-4 p-4 min-h-0">
									<div className="flex gap-4 items-start justify-between max-sm:flex-col">
										<h1 className="w-full text-white font-luckiest-guy text-3xl max-xl:text-2xl">
											{round.name}
										</h1>
										{round.community && !round.event ? (
											<Link
												href={`/c/${round.community.handle}`}
												className="bg-grey-500 hover:bg-grey-400 transition-colors py-2 pl-2 pr-3 flex-shrink-0 rounded-full flex text-white items-center gap-2 text-sm font-semibold w-fit max-w-36"
											>
												<img
													alt={round.community.name}
													src={round.community.image}
													className="w-5 h-5 rounded-full object-cover"
												/>
												<p className="text-white truncate">
													{round.community.name}
												</p>
											</Link>
										) : null}
										{round.event ? (
											<Link
												href={`/events/${round.event.handle}`}
												className="bg-grey-500 hover:bg-grey-400 transition-colors py-2 pl-2 pr-3 flex-shrink-0 rounded-full flex text-white items-center gap-2 text-sm font-semibold w-fit max-w-36"
											>
												<img
													alt={round.event.name}
													src={round.event.image}
													className="w-5 h-5 rounded-full object-cover"
												/>
												<p className="text-white truncate">
													{round.event.name}
												</p>
											</Link>
										) : null}
									</div>
									<Markdown
										markdown={round.content}
										readOnly
										className="h-full overflow-y-auto custom-scrollbar"
									/>
								</div>
							</div>
							<div className="flex flex-col gap-4 w-full h-full">
								<div className="flex max-md:flex-col gap-4 h-full min-h-0 w-full">
									<div className="bg-grey-800 min-w-52 max-sm:min-w-full flex-1 max-xl:max-h-80 rounded-xl flex flex-col gap-4 p-4">
										<h2 className="font-bebas-neue text-2xl text-white">
											Awards
										</h2>
										<div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar">
											{round.awards.map((award, index) => (
												<div
													key={award.id}
													className="flex items-center justify-between"
												>
													<div className="flex gap-2 items-center">
														<img
															alt={award.asset.name}
															src={award.asset.image}
															title={award.asset.name}
															className="w-7 h-7 rounded-md object-cover object-center"
														/>
														<p className="text-white whitespace-nowrap text-sm">
															{award.asset.decimals
																? formatUnits(
																		BigInt(award.value),
																		award.asset.decimals,
																	)
																: award.value}{" "}
															{award.asset.name}
														</p>
													</div>
													<div
														className={twMerge(
															"rounded-md bg-grey-600 font-bold text-white text-xs flex items-center justify-center w-[30px] py-0.5",
															index === 0 && "bg-gold-500 text-gold-900",
															index === 1 && "bg-silver-500 text-silver-900",
															index === 2 && "bg-bronze-500 text-bronze-900",
															index > 2 && "bg-blue-500 text-blue-900",
														)}
													>
														{numberToOrdinal(award.place)}
													</div>
												</div>
											))}
										</div>
										<p>
											{round.awards.length}{" "}
											{round.awards.length > 1 ? "winners" : "winner"}
										</p>
									</div>
									<div className="bg-grey-800 min-w-96 max-sm:min-w-full max-xl:max-h-80 flex-1 rounded-xl flex flex-col p-4 gap-4">
										<div className="flex items-center justify-between">
											<h2 className="font-bebas-neue text-2xl text-white">
												Activity
											</h2>
											<div
												title="Participants"
												className="flex items-center gap-2 text-white pr-2"
											>
												<Users className="w-4 h-4" />
												{/* {Number(round.uniqueProposers) +
													Number(round.uniqueVoters)} */}
												0
											</div>
										</div>
										<div className="flex flex-col gap-3 h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
											{(
												[
													{
														type: "state",
														name: "Round started",
														timestamp: new Date(round.start),
														icon: (
															<div className="bg-green p-1 w-5 h-5 text-white rounded-md">
																<Megaphone className="w-full h-full" />
															</div>
														),
														color: "text-green",
													},
													{
														type: "state",
														name: "Voting started",
														timestamp: new Date(round.votingStart),
														icon: (
															<div className="bg-purple p-1 w-5 h-5 text-white rounded-md">
																<TicketCheck className="w-full h-full" />
															</div>
														),
														color: "text-purple",
													},
													{
														type: "state",
														name: "Round ended",
														timestamp: new Date(round.end),
														icon: (
															<div className="bg-red p-1 w-5 h-5 text-white rounded-md">
																<Gavel className="w-full h-full" />
															</div>
														),
														color: "text-red",
													},
													...proposalActivity,
													...voteActivity,
												] satisfies Activity[]
											)
												.filter((event) => event.timestamp < new Date())
												.sort(
													(a, b) =>
														b.timestamp.getTime() - a.timestamp.getTime(),
												)
												.map((event, index) => (
													<div key={`activity-${index}`}>
														{event.type === "state" ? (
															<div className="flex items-center justify-between">
																<div className="flex items-center gap-2">
																	{event.icon}
																	<p className={event.color}>{event.name}</p>
																</div>
																<p className="text-grey-200 text-sm">
																	<Countup date={event.timestamp} />
																</p>
															</div>
														) : null}
														{event.type === "proposal" ? (
															<div className="flex items-center justify-between">
																<div className="flex items-center gap-2">
																	<Link
																		href={`/users/${event.user.id}`}
																		className="text-white flex items-center gap-2 group hover:text-white/70 transition-all"
																	>
																		<img
																			alt={event.user.name}
																			src={event.user.image}
																			className={twMerge(
																				"w-5 h-5 rounded-full object-cover group-hover:brightness-75 transition-all",
																			)}
																		/>
																		{event.user.name}
																	</Link>
																	<p className="text-yellow">
																		created a proposal
																	</p>
																</div>
																<p className="text-grey-200 text-sm">
																	<Countup date={event.timestamp} />
																</p>
															</div>
														) : null}
														{event.type === "vote" ? (
															<div className="flex items-center justify-between">
																<div className="flex items-center gap-2">
																	<Link
																		href={`/users/${event.user.id}`}
																		className="text-white flex items-center gap-1.5 group hover:text-white/70 transition-all"
																	>
																		<img
																			alt={event.user.name}
																			src={event.user.image}
																			className={twMerge(
																				"w-5 h-5 rounded-full object-cover group-hover:brightness-75 transition-all",
																			)}
																		/>
																		{event.user.name}
																	</Link>
																	<p className="flex text-blue-500 text-nowrap">
																		+{event.count}
																	</p>
																	<Link
																		href={`/users/${event.for.user.id}`}
																		className="text-white flex items-center gap-1.5 group hover:text-white/70 transition-all"
																	>
																		<img
																			alt={event.for.user.name}
																			src={event.for.user.image}
																			className={twMerge(
																				"w-5 h-5 rounded-full object-cover group-hover:brightness-75 transition-all",
																			)}
																		/>
																		{event.for.user.name}
																	</Link>
																</div>
																<p className="text-grey-200 text-sm">
																	<Countup date={event.timestamp} />
																</p>
															</div>
														) : null}
													</div>
												))}
										</div>
									</div>
								</div>
								<RoundTimeline round={round} />
							</div>
						</div>
						<Proposals
							round={round}
							user={
								user
									? {
											...user,
											priorVotes,
											canPropose: requiredProposingActions.every(
												(action) => action.completed,
											),
											canVote: requiredVotingActions.every(
												(action) => action.completed,
											),
										}
									: undefined
							}
							openProposal={searchParams.p ? searchParams.p : undefined}
							lilnounVotes={lilnounVotes}
							japanExtraVotes={japanExtraVotes}
							extraActionVotes={extraActionVotes}
						/>
					</div>
				</div>
			</div>
			{user ? (
				<RoundActionsModal
					type="proposing"
					user={user}
					actions={proposingActions}
				/>
			) : null}
			{user ? (
				<RoundActionsModal type="voting" user={user} actions={votingActions} />
			) : null}
		</>
	);
}
