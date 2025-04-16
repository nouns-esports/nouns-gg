"use client";

import React, { useMemo, useState } from "react";
import Button from "../Button";
import { twMerge } from "tailwind-merge";
import { roundState } from "@/utils/roundState";
import { numberToOrdinal } from "@/utils/numberToOrdinal";
import { ToggleModal } from "../Modal";
import type { getRound } from "@/server/queries/rounds";
import { lexicalToDescription } from "@/utils/lexicalToDescription";
import Link from "../Link";
import { useModal } from "../Modal";
import CastVotesModal from "../modals/CastVotesModal";
import ViewProposalModal from "../modals/VewProposalModal";
import type { AuthenticatedUser } from "@/server/queries/users";
import VoteSelector from "../VoteSelector";
import ShareVotesModal from "../modals/ShareVotesModal";
import type { rounds } from "~/packages/db/schema/public";
import Countdown from "../Countdown";
import { toast } from "../Toasts";
import { level } from "@/utils/level";

export default function Proposals(props: {
	round: NonNullable<Awaited<ReturnType<typeof getRound>>>;
	user?: AuthenticatedUser & {
		priorVotes: number;
		hasProposerCredential: boolean;
		hasVoterCredential: boolean;
	};
	openProposal?: number;
}) {
	const [selectedVotes, setSelectedVotes] = useState<Record<string, number>>(
		{},
	);

	function addVote(proposal: number, count: number) {
		if (remainingVotes < 1) return;

		setSelectedVotes((prev) => ({
			...prev,
			[proposal]: (prev[proposal] ?? 0) + count,
		}));
	}

	function removeVote(proposal: number, count: number) {
		if ((selectedVotes[proposal] ?? 0) < 1) return;

		setSelectedVotes((prev) => ({
			...prev,
			[proposal]: (prev[proposal] ?? 0) - count,
		}));
	}

	const votesSelected = useMemo(() => {
		return Object.values(selectedVotes).reduce((acc, curr) => acc + curr, 0);
	}, [selectedVotes]);

	const remainingVotes = useMemo(() => {
		return (
			(props.user?.votes ?? 1) - votesSelected - (props.user?.priorVotes ?? 0)
		);
	}, [votesSelected, props.user?.votes, props.user?.priorVotes]);

	const userProposal = props.round.proposals.find(
		(proposal) => proposal.user?.id === props.user?.id,
	);

	const { open: openSignInModal } = useModal("sign-in");
	const { open: openCastVotesModal } = useModal("cast-votes");
	const { open: openShareVotesModal } = useModal("share-votes");

	const state = roundState({
		start: props.round.start,
		votingStart: props.round.votingStart,
		end: props.round.end,
	});

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex justify-between items-center w-full gap-4 max-md:flex-col max-md:items-start">
					<div className="flex items-center gap-4 max-lg:flex-col max-lg:items-start max-md:flex-row max-md:items-center max-md:justify-between max-md:w-full">
						<h3 className="text-white font-luckiest-guy text-3xl">Proposals</h3>
						{state !== "Ended" && state !== "Upcoming" ? (
							<div className="flex items-center px-3 py-2 gap-2 bg-grey-800  font-semibold rounded-xl">
								<div className="flex items-center gap-1.5">
									<div className="w-2 h-2 rounded-full bg-red animate-pulse" />
									<p className="text-red">
										{
											{
												Proposing: "Proposing",
												Voting: "Voting",
											}[state]
										}
									</p>
								</div>
								<p className="text-white">
									<Countdown
										date={
											{
												Proposing: props.round.votingStart,
												Voting: props.round.end,
											}[state]
										}
									/>
								</p>
							</div>
						) : null}
					</div>

					<div className="flex gap-4 items-center max-md:justify-between max-md:w-full">
						{(() => {
							if (state === "Proposing") {
								if (!props.user) {
									return (
										<>
											<p className="text-white">
												You must be signed in to propose
											</p>
											<Button onClick={() => openSignInModal()}>Sign In</Button>
										</>
									);
								}

								if (
									props.round.proposerCredential &&
									!props.user.hasProposerCredential
								) {
									if (
										props.round.proposerCredential ===
										"0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03"
									) {
										return (
											<>
												<p className="text-white">
													You must be a Nouner or delegate to propose
												</p>
												<Button href="https://nouns.camp/" newTab>
													View Nouns
												</Button>
											</>
										);
									}

									if (
										props.round.proposerCredential ===
										"0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B"
									) {
										return (
											<>
												<p className="text-white">
													You must be a LilNouner or delegate to propose
												</p>
												<Button href="https://lilnouns.wtf/" newTab>
													View LilNouns
												</Button>
											</>
										);
									}

									return (
										<>
											<p className="text-white">
												You must hold this token to propose
											</p>
											<Button
												href={`https://matcha.xyz/tokens/ethereum/${props.round.proposerCredential}`}
												newTab
											>
												View Token
											</Button>
										</>
									);
								}

								if (userProposal) {
									return (
										<>
											<p className="text-white">
												You can edit your proposal until voting starts
											</p>
											<Button href={`/rounds/${props.round.handle}/propose`}>
												Edit Proposal
											</Button>
										</>
									);
								}

								return (
									<Button href={`/rounds/${props.round.handle}/propose`}>
										Create Proposal
									</Button>
								);
							}

							if (state === "Voting") {
								if (!props.user) {
									return (
										<>
											<p className="text-white">
												You must be signed in to vote
											</p>
											<Button onClick={() => openSignInModal()}>Sign In</Button>
										</>
									);
								}

								if (props.round.minVoterRank && props.user.level < 15) {
									return (
										<>
											<div className="flex items-center gap-2">
												<p className="text-white">
													You must be level 15 or higher to vote
												</p>
											</div>
											<Button href="/user">View Profile</Button>
										</>
									);
								}

								if (
									props.round.voterCredential &&
									!props.user.hasVoterCredential
								) {
									if (
										props.round.voterCredential ===
										"0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03"
									) {
										return (
											<>
												<p className="text-white">
													You must be a Nouner or delegate to vote
												</p>
												<Button href="https://nouns.camp/" newTab>
													View Nouns
												</Button>
											</>
										);
									}

									if (
										props.round.voterCredential ===
										"0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B"
									) {
										return (
											<>
												<p className="text-white">
													You must be a LilNouner or delegate to vote
												</p>
												<Button href="https://lilnouns.wtf/" newTab>
													View LilNouns
												</Button>
											</>
										);
									}

									return (
										<>
											<p className="text-white">
												You must hold this token to vote
											</p>
											<Button
												href={`https://matcha.xyz/tokens/ethereum/${props.round.voterCredential}`}
												newTab
											>
												View Token
											</Button>
										</>
									);
								}

								if (remainingVotes < 1 && votesSelected === 0) {
									return (
										<>
											<p className="text-white">
												Your votes have been submitted
											</p>
											<ToggleModal id="share-votes">
												<Button onClick={() => openShareVotesModal()}>
													Share
												</Button>
											</ToggleModal>
										</>
									);
								}

								return (
									<>
										<p className="text-white">
											{remainingVotes}/{props.user.votes} votes remaining
										</p>
										<Button
											disabled={votesSelected < 1}
											onClick={() => openCastVotesModal()}
										>
											Submit Votes
										</Button>
									</>
								);
							}

							if (state === "Ended") {
								if (props.user) {
									for (let i = 0; i < props.round.awards.length; i++) {
										if (props.round.proposals[i]?.user === props.user.id) {
											return (
												<>
													<p className="text-white">Your proposal won!</p>
													<Button href="/user">View Rewards</Button>
												</>
											);
										}
									}

									if (remainingVotes < 1 && votesSelected === 0) {
										return (
											<>
												<p className="text-white">
													Your votes have been submitted
												</p>
												<ToggleModal id="share-votes">
													<Button onClick={() => openShareVotesModal()}>
														Share
													</Button>
												</ToggleModal>
											</>
										);
									}
								}
							}
						})()}
					</div>
				</div>
				<div className="gap-4 grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
					{props.round.proposals
						.toSorted((a, b) => {
							if (state === "Proposing") {
								return (b.user?.rank?.place ?? 0) - (a.user?.rank?.place ?? 0);
							}

							const votesDiff = b.totalVotes - a.totalVotes;

							if (votesDiff === 0) {
								return (b.user?.rank?.place ?? 0) - (a.user?.rank?.place ?? 0);
							}

							return votesDiff;
						})
						.map((proposal, index) => {
							const Component = props.round.type === "url" ? Link : ToggleModal;
							return (
								<Component
									key={proposal.id}
									id={`view-proposal-${proposal.id}`}
									href={proposal.url ?? ""}
									newTab
									className={twMerge(
										"relative flex flex-col gap-4 bg-grey-800 hover:bg-grey-600 transition-colors rounded-xl overflow-hidden aspect-square w-full h-full group p-4",
										state === "Ended" &&
											index < props.round.awards.length &&
											index === 0 &&
											"border-[3px] border-gold-500 bg-gold-900 hover:bg-gold-800 text-white",
										state === "Ended" &&
											index < props.round.awards.length &&
											index === 1 &&
											"border-[3px] border-silver-500 bg-silver-900 hover:bg-silver-800 text-white",
										state === "Ended" &&
											index < props.round.awards.length &&
											index === 2 &&
											"border-[3px] border-bronze-500 bg-bronze-900 hover:bg-bronze-800 text-white",
										state === "Ended" &&
											index > 2 &&
											index < props.round.awards.length &&
											"border-[3px] border-blue-500 bg-blue-900 hover:bg-blue-800 text-white",
									)}
								>
									<p className="text-white font-bebas-neue text-2xl line-clamp-2 flex-shrink-0 leading-[1.15] /h-[2lh]">
										{proposal.title}
									</p>
									{proposal.image ? (
										<img
											alt={proposal.title}
											src={`${proposal.image}?img-width=500&img-onerror=redirect`}
											className="flex w-full h-full object-cover overflow-hidden rounded-xl select-none"
										/>
									) : (
										<div className="relative w-full h-full overflow-hidden">
											<p
												className={twMerge(
													"text-grey-200 h-full",
													state === "Ended" &&
														index < props.round.awards.length &&
														"text-white",
												)}
											>
												{lexicalToDescription(proposal.content ?? "")}
											</p>
											<div
												className={twMerge(
													"absolute left-0 w-full group-hover:opacity-0 opacity-100 transition-opacity bg-gradient-to-t from-grey-800 to-transparent h-10 bottom-0 z-10",
													state === "Ended" &&
														index < props.round.awards.length &&
														index === 0 &&
														"from-gold-900",
													state === "Ended" &&
														index < props.round.awards.length &&
														index === 1 &&
														"from-silver-900",
													state === "Ended" &&
														index < props.round.awards.length &&
														index === 2 &&
														"from-bronze-900",
													state === "Ended" &&
														index > 2 &&
														index < props.round.awards.length &&
														"from-blue-900",
												)}
											/>
											<div
												className={twMerge(
													"absolute left-0 w-full group-hover:opacity-100 opacity-0 transition-opacity bg-gradient-to-t from-grey-600 to-transparent h-20 bottom-0 z-10",
													state === "Ended" &&
														index < props.round.awards.length &&
														index === 0 &&
														"from-gold-800",
													state === "Ended" &&
														index < props.round.awards.length &&
														index === 1 &&
														"from-silver-800",
													state === "Ended" &&
														index < props.round.awards.length &&
														index === 2 &&
														"from-bronze-800",
													state === "Ended" &&
														index > 2 &&
														index < props.round.awards.length &&
														"from-blue-800",
												)}
											/>
										</div>
									)}
									<div className="flex justify-between items-center flex-shrink-0">
										{proposal.user ? (
											<Link
												href={`/users/${proposal.user.discord ?? proposal.user.id}`}
												className="flex gap-2 items-center text-white"
											>
												<img
													alt={proposal.user.name}
													src={proposal.user.image}
													className="h-6 w-6 rounded-full"
												/>
												{proposal.user.name}
											</Link>
										) : (
											<div />
										)}
										<div className="flex items-center gap-4">
											{state === "Ended" &&
											index < props.round.awards.length ? (
												<div
													className={twMerge(
														"rounded-md bg-grey-600 font-bold text-white flex items-center text-sm justify-center px-2 py-0.5",
														index === 0 && "bg-gold-500 text-gold-900",
														index === 1 && "bg-silver-500 text-silver-900",
														index === 2 && "bg-bronze-500 text-bronze-900",
														index > 2 && "bg-blue-500 text-blue-900",
													)}
												>
													{numberToOrdinal(index + 1)}
												</div>
											) : (
												""
											)}

											<VoteSelector
												proposal={proposal.id}
												votes={proposal.totalVotes}
												addVote={addVote}
												removeVote={removeVote}
												selectedVotes={selectedVotes[proposal.id]}
												awardCount={props.round.awards.length}
												index={index}
												roundState={state}
												userCanVote={
													!!props.user?.nexus?.rank &&
													props.user.votes > props.user.priorVotes
												}
											/>
										</div>
									</div>
								</Component>
							);
						})}
					{props.round.proposals.length < 1 ? (
						<div className="mt-4 flex gap-4 justify-center items-center">
							<img
								src="/fire-sticker.png"
								alt="No proposals graphic"
								className="h-32"
							/>
							<p className="text-grey-200 text-lg max-w-80">
								There are no proposals yet.{" "}
								{state === "Proposing" ? "Be the first to propose?" : ""}
							</p>
						</div>
					) : (
						""
					)}
				</div>
			</div>
			<CastVotesModal
				round={{ id: props.round.id, handle: props.round.handle }}
				proposals={props.round.proposals}
				selectedVotes={selectedVotes}
				onVotesCast={() => setSelectedVotes({})}
			/>
			<ShareVotesModal round={props.round.handle} />
			{props.round.proposals.map((proposal) => (
				<ViewProposalModal
					key={proposal.id}
					round={props.round}
					proposal={proposal}
					user={props.user}
					addVote={addVote}
					removeVote={removeVote}
					selectedVotes={selectedVotes}
					userCanVote={
						!!props.user?.nexus?.rank &&
						props.user.votes > props.user.priorVotes
					}
					isOpen={props.openProposal === proposal.id}
				/>
			))}
		</>
	);
}
