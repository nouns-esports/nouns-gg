"use client";

import { Modal, ToggleModal, useModal } from "@/components/Modal";
import { X } from "lucide-react";
import Link from "../Link";
import { TwitterLogo } from "phosphor-react-sc";
import Markdown from "../lexical/Markdown";
import type { rounds } from "~/packages/db/schema/public";
import { roundState } from "@/utils/roundState";
import type { AuthenticatedUser } from "@/server/queries/users";
import VoteSelector from "../VoteSelector";
import type { getRound } from "@/server/queries/rounds";
import Button from "../Button";
import { twMerge } from "tailwind-merge";
import VideoEmbedPlayer from "../VideoEmbedPlayer";

export default function ViewProposalModal(props: {
	round: NonNullable<Awaited<ReturnType<typeof getRound>>>;
	proposal: NonNullable<
		Awaited<ReturnType<typeof getRound>>
	>["proposals"][number];
	user?: AuthenticatedUser & {
		priorVotes: number;
	};
	isOpen?: boolean;
	addVote: (proposal: number, amount: number) => void;
	removeVote: (proposal: number, amount: number) => void;
	selectedVotes: Record<string, number>;
	userCanVote: boolean;
}) {
	const { close } = useModal(`view-proposal-${props.proposal.id}`);
	const { open: openCastVotesModal } = useModal("cast-votes");

	const state = roundState({
		start: props.round.start,
		votingStart: props.round.votingStart,
		end: props.round.end,
	});

	return (
		<Modal
			id={`view-proposal-${props.proposal.id}`}
			handle
			isOpen={props.isOpen}
			queryParam={["p", props.proposal.id.toString()]}
			className={twMerge(
				"relative flex flex-col gap-4 w-2/3 max-h-[66.66%] max-xl:max-h-none p-4 max-w-screen-lg max-xl:w-full max-xl:h-[90dvh] overflow-hidden",
				props.round.type === "markdown" && "",
			)}
		>
			<div className="flex gap-4 justify-between">
				<h2 className="text-white font-luckiest-guy text-3xl">
					{props.proposal.title}
				</h2>
				<ToggleModal
					id={`view-proposal-${props.proposal.id}`}
					tabIndex={0}
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors h-min"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>
			<div className="flex flex-col h-full overflow-y-scroll custom-scrollbar gap-2">
				{
					{
						markdown: props.proposal.content ? (
							<Markdown markdown={props.proposal.content} readOnly />
						) : null,
						image: (
							<div className="flex flex-col gap-4">
								<img
									alt={props.proposal.title}
									src={props.proposal.image ?? ""}
									className="flex h-full object-contain rounded-xl"
								/>
								{props.proposal.content ? (
									<Markdown markdown={props.proposal.content} readOnly />
								) : null}
							</div>
						),
						video: (
							<div className="flex flex-col gap-4">
								<VideoEmbedPlayer url={props.proposal.video ?? ""} />
								{props.proposal.content ? (
									<Markdown markdown={props.proposal.content} readOnly />
								) : null}
							</div>
						),
						url: null,
					}[props.round.type as (typeof rounds.$inferSelect)["type"]]
				}
			</div>
			<div className="flex justify-between items-center">
				{props.proposal.user ? (
					<div className="flex gap-4 items-center">
						<div className="rounded-full flex items-center text-white gap-3 font-semibold text-xl">
							<img
								alt={props.proposal.user.name}
								src={props.proposal.user.image}
								className="rounded-full h-9 w-9"
							/>
							{props.proposal.user.name}
						</div>
						<div className="flex gap-3 items-center">
							{props.proposal.user.twitter ? (
								<Link
									href={`https://twitter.com/${props.proposal.user.twitter}`}
									newTab
								>
									<TwitterLogo
										className="w-6 h-6 text-white hover:opacity-80 transition-opacity"
										weight="fill"
									/>
								</Link>
							) : (
								""
							)}
						</div>
					</div>
				) : (
					<div />
				)}
				<div className="flex gap-4">
					<VoteSelector
						proposal={props.proposal.id}
						votes={props.proposal.totalVotes}
						selectedVotes={props.selectedVotes[props.proposal.id]}
						userCanVote={props.userCanVote}
						roundState={state}
						addVote={props.addVote}
						removeVote={props.removeVote}
					/>
					{state === "Voting" && props.userCanVote ? (
						<Button
							disabled={!props.selectedVotes[props.proposal.id]}
							onClick={() => {
								openCastVotesModal();
								close();
							}}
							size="sm"
						>
							Submit
						</Button>
					) : (
						""
					)}
				</div>
			</div>
		</Modal>
	);
}
