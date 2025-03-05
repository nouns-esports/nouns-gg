"use client";

import type { roundState } from "@/utils/roundState";
import { motion, AnimatePresence } from "framer-motion";
import { CaretUp, CaretDown, ChartBarHorizontal } from "phosphor-react-sc";
import { twMerge } from "tailwind-merge";
import type { ranks } from "~/packages/db/schema/public";

export default function VoteSelector(props: {
	proposal: number;
	votes: number;
	selectedVotes?: number;
	userCanVote: boolean;
	userRank?: typeof ranks.$inferSelect;
	minRank?: typeof ranks.$inferSelect;
	roundState: ReturnType<typeof roundState>;
	awardCount?: number;
	index?: number;
	addVote: (proposal: number, votes: number) => void;
	removeVote: (proposal: number, votes: number) => void;
}) {
	if (props.roundState === "Proposing" || props.roundState === "Upcoming") {
		return;
	}

	if (
		props.roundState === "Ended" ||
		(props.roundState === "Voting" && !props.userCanVote)
		// (!props.userRank || props.remainingVotes < 1)
	) {
		return (
			<div
				className={twMerge(
					"flex items-center gap-2 text-2xl text-center select-none font-bebas-neue",
					props.index !== undefined &&
						props.awardCount !== undefined &&
						props.roundState === "Ended" &&
						props.index < props.awardCount
						? "text-white"
						: "text-grey-200",
				)}
			>
				{props.votes}
				<ChartBarHorizontal className="w-5 h-5 -rotate-90" weight="fill" />
			</div>
		);
	}

	return (
		<motion.div
			//@ts-ignore
			className="flex items-center gap-2 flex-shrink-0 text-grey-200 text-2xl font-bebas-neue text-center text-nowrap select-none"
			layout
			initial={{ width: "auto" }}
			animate={{ width: "auto" }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
		>
			<button
				onClick={(e) => {
					e.stopPropagation();
					props.addVote(props.proposal, 1);
				}}
			>
				<CaretUp
					className="w-5 h-5 text-grey-200 hover:text-white transition-colors"
					weight="fill"
				/>
			</button>
			<div className="flex gap-1.5 items-center">
				<motion.p layout>{props.votes}</motion.p>
				<AnimatePresence>
					{props.selectedVotes ? (
						<motion.span
							key="selected-votes"
							//@ts-ignore
							className="text-white select-none"
							initial={{ opacity: 0, width: 0 }}
							animate={{ opacity: 1, width: "auto" }}
							exit={{ opacity: 0, width: 0 }}
						>
							{" "}
							+ {props.selectedVotes}
						</motion.span>
					) : null}
				</AnimatePresence>
			</div>
			<button
				onClick={(e) => {
					e.stopPropagation();
					props.removeVote(props.proposal, 1);
				}}
			>
				<CaretDown
					className="w-5 h-5 text-grey-200 hover:text-white transition-colors"
					weight="fill"
				/>
			</button>
		</motion.div>
	);
}
