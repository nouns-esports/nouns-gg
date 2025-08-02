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
import { Info } from "lucide-react";
import HideProposalModal from "../modals/HideProposalModal";

export default function Proposals(props: {
	round: NonNullable<Awaited<ReturnType<typeof getRound>>>;
	user?: AuthenticatedUser & {
		priorVotes: number;
		canPropose: boolean;
		canVote: boolean;
	};
	openProposal?: string;
	allocatedVotes: number;
	unusedPurchasedVotes: number;
}) {
	const [selectedVotes, setSelectedVotes] = useState<Record<string, number>>(
		{},
	);

	function addVote(proposal: string, count: number) {
		if (remainingVotes - count < 0) return;

		setSelectedVotes((prev) => ({
			...prev,
			[proposal]: (prev[proposal] ?? 0) + count,
		}));
	}

	function removeVote(proposal: string, count: number) {
		if ((selectedVotes[proposal] ?? 0) < 1) return;

		setSelectedVotes((prev) => ({
			...prev,
			[proposal]: (prev[proposal] ?? 0) - count,
		}));
	}

	const votesSelected = useMemo(() => {
		return Object.values(selectedVotes).reduce((acc, curr) => acc + curr, 0);
	}, [selectedVotes]);

	const allocatedVotes = useMemo(() => {
		const priorVotes = props.user?.priorVotes ?? 0;

		const dynamicRemaining = Math.max(props.allocatedVotes - priorVotes, 0);

		return dynamicRemaining + props.unusedPurchasedVotes;
	}, [
		props.allocatedVotes,
		props.unusedPurchasedVotes,
		props.user?.priorVotes,
	]);

	const remainingVotes = useMemo(() => {
		return allocatedVotes - votesSelected;
	}, [votesSelected, allocatedVotes]);

	const userProposals = props.round.proposals.filter(
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

	const hasProposingRequirements =
		props.round.actions.filter((a) => a.type === "proposing").length > 0;
	const hasVotingRequirements =
		props.round.actions.filter((a) => a.type === "voting").length > 0;

	const userIsAdmin = props.round.community.admins.some(
		(admin) => admin.user === props.user?.id,
	);

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
						{(state === "Proposing" || state === "Upcoming") &&
						hasProposingRequirements ? (
							<ToggleModal
								id="round-actions-proposing"
								className="text-red flex items-center gap-1.5 hover:text-red/70 transition-colors"
							>
								Proposal Requirements
								<Info className="w-4 h-4" />
							</ToggleModal>
						) : null}
						{state === "Voting" && hasVotingRequirements ? (
							<ToggleModal
								id="round-actions-voting"
								className="text-red flex items-center gap-1.5 hover:text-red/70 transition-colors"
							>
								Voting Requirements
								<Info className="w-4 h-4" />
							</ToggleModal>
						) : null}
						{(() => {
							if (state === "Proposing") {
								if (!props.user) {
									return (
										<Button onClick={() => openSignInModal()}>Sign In</Button>
									);
								}

								const maxProposals = props.round.maxProposals ?? Infinity;

								return (
									<Button
										href={`/c/${props.round.community.handle}/rounds/${props.round.handle}/propose`}
										disabled={
											userProposals.length >= maxProposals ||
											!props.user.canPropose
										}
									>
										Create Proposal
									</Button>
								);
							}

							if (state === "Voting") {
								console.log(
									"CHECK",
									props.user?.canVote,
									allocatedVotes,
									remainingVotes,
									votesSelected,
								);
								if (!props.user) {
									return (
										<Button onClick={() => openSignInModal()}>Sign In</Button>
									);
								}

								if (!props.user.canVote || allocatedVotes === 0) {
									return <Button disabled>Submit Votes</Button>;
								}

								if (remainingVotes < 1 && votesSelected === 0) {
									return (
										<ToggleModal id="share-votes">
											<Button onClick={() => openShareVotesModal()}>
												Share Votes
											</Button>
										</ToggleModal>
									);
								}

								return (
									<Button
										disabled={votesSelected < 1}
										onClick={() => openCastVotesModal()}
									>
										Submit Votes - {votesSelected}/{allocatedVotes}
									</Button>
								);
							}

							if (state === "Ended" && props.user) {
								if (remainingVotes < 1 && votesSelected === 0) {
									return (
										<ToggleModal id="share-votes">
											<Button onClick={() => openShareVotesModal()}>
												Share Votes
											</Button>
										</ToggleModal>
									);
								}
							}
						})()}
					</div>
				</div>
				<div className="gap-4 grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
					{props.round.proposals
						.toSorted((a, b) => {
							if (state === "Ended") {
								if (a.winner != null && b.winner != null) {
									return a.winner - b.winner;
								}

								if (a.winner != null) return -1;
								if (b.winner != null) return 1;
							}

							const votesDiff = b.totalVotes - a.totalVotes;
							if (votesDiff !== 0) return votesDiff;

							return (
								new Date(b.createdAt).getTime() -
								new Date(a.createdAt).getTime()
							);
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
												href={`/users/${proposal.user.id}`}
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
											{state === "Proposing" &&
											userProposals.some((p) => p.id === proposal.id) ? (
												<Button
													onClick={(e) => e.stopPropagation()}
													href={`/c/${props.round.community.handle}/rounds/${props.round.handle}/proposals/${proposal.id}`}
													size="sm"
													className="relative z-50"
												>
													Edit
												</Button>
											) : null}

											{state === "Proposing" && userIsAdmin ? (
												<ToggleModal id={`hide-proposal-${proposal.id}`}>
													<Button size="sm" className="relative z-50">
														Hide
													</Button>
												</ToggleModal>
											) : null}

											{state === "Voting" || state === "Ended" ? (
												<VoteSelector
													ten={props.round.handle === "cooking-bad"}
													proposal={proposal.id}
													votes={proposal.totalVotes}
													addVote={addVote}
													removeVote={removeVote}
													selectedVotes={selectedVotes[proposal.id]}
													awardCount={props.round.awards.length}
													index={index}
													roundState={state}
													userCanVote={
														!!props.user?.nexus && allocatedVotes > 0
													}
												/>
											) : null}
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
			{props.user ? (
				<CastVotesModal
					round={{ id: props.round.id, handle: props.round.handle }}
					proposals={props.round.proposals}
					user={props.user}
					selectedVotes={selectedVotes}
					onVotesCast={() => setSelectedVotes({})}
				/>
			) : null}
			{props.user ? (
				<ShareVotesModal round={props.round.handle} user={props.user} />
			) : null}
			{props.round.proposals.map((proposal) => (
				<ViewProposalModal
					key={proposal.id}
					round={props.round}
					proposal={proposal}
					user={props.user}
					addVote={addVote}
					removeVote={removeVote}
					selectedVotes={selectedVotes}
					userCanVote={!!props.user?.nexus && allocatedVotes > 0}
					isOpen={props.openProposal === proposal.id}
				/>
			))}
			{props.round.proposals.map((proposal) =>
				userIsAdmin ? (
					<HideProposalModal key={proposal.id} proposal={proposal.id} />
				) : null,
			)}
		</>
	);
}
