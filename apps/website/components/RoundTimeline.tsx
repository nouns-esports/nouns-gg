"use client";

import type { rounds } from "~/packages/db/schema/public";
import { twMerge } from "tailwind-merge";
import DateComponent from "./Date";
import { roundState } from "@/utils/roundState";
import { Check, Timer } from "lucide-react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMemo } from "react";

export default function RoundTimeline(props: {
	round: typeof rounds.$inferSelect;
}) {
	const now = new Date();
	const start = new Date(props.round.start);
	const votingStart = new Date(props.round.votingStart);
	const end = new Date(props.round.end);

	const state = roundState({
		start: props.round.start,
		votingStart: props.round.votingStart,
		end: props.round.end,
	});

	const { width } = useWindowSize();
	const short = useMemo(() => !!((width ?? 0) <= 600), [width]);

	const votingProgress =
		((now.getTime() - start.getTime()) /
			(votingStart.getTime() - start.getTime())) *
		100;

	const endProgress =
		((now.getTime() - votingStart.getTime()) /
			(end.getTime() - votingStart.getTime())) *
		100;

	return (
		<div className="bg-grey-800 w-full gap-2 rounded-xl flex flex-col flex-shrink-0 py-4 px-5 justify-between">
			<div className="flex items-center w-full">
				<p className="text-white w-full">
					{state === "Upcoming" ? "Round Starts" : "Round Started"}
				</p>
				<p className="text-white w-full text-center">
					{state === "Upcoming" || state === "Proposing"
						? "Voting Starts"
						: "Voting Started"}
				</p>
				<p className="text-white w-full text-right">
					{state === "Ended" ? "Round Ended" : "Round Ends"}
				</p>
			</div>
			<div className="flex justify-between items-center w-full">
				{
					{
						Upcoming: <Upcoming />,
						Proposing: <Active />,
						Voting: <Completed />,
						Ended: <Completed />,
					}[state]
				}
				<div className="h-1 w-full relative bg-[repeating-linear-gradient(to_right,transparent,transparent_2px,#333333_2px,#333333_4px)]">
					{state !== "Upcoming" ? (
						<div
							style={{
								width:
									state === "Proposing"
										? `${votingProgress > 100 ? 100 : votingProgress}%`
										: "100%",
							}}
							className={twMerge(
								"h-1 absolute",
								state === "Proposing" ? "bg-blue-700" : "bg-green",
							)}
						>
							{state === "Proposing" ? (
								<div className="h-3 w-3 rounded-full right-0 absolute -top-1 bg-blue-700" />
							) : null}
						</div>
					) : (
						""
					)}
				</div>
				{
					{
						Upcoming: <Upcoming />,
						Proposing: <Upcoming />,
						Voting: <Active />,
						Ended: <Completed />,
					}[state]
				}
				<div className="h-1 w-full relative bg-[repeating-linear-gradient(to_right,transparent,transparent_2px,#333333_2px,#333333_4px)]">
					{state === "Voting" || state === "Ended" ? (
						<div
							style={{
								width:
									state === "Voting"
										? `${endProgress > 100 ? 100 : endProgress}%`
										: "100%",
							}}
							className={twMerge(
								"absolute h-1",
								state === "Voting" ? "bg-blue-700" : "bg-green",
							)}
						>
							{state === "Voting" ? (
								<div className="h-3 w-3 rounded-full right-0 absolute -top-1 bg-blue-700" />
							) : null}
						</div>
					) : (
						""
					)}
				</div>
				{
					{
						Upcoming: <Upcoming />,
						Proposing: <Upcoming />,
						Voting: <Upcoming />,
						Ended: <Completed />,
					}[state]
				}
			</div>
			<div className="flex items-center w-full">
				<p className="w-full whitespace-nowrap">
					<DateComponent timestamp={props.round.start} short={short} />
				</p>
				<p className="w-full text-center whitespace-nowrap">
					<DateComponent timestamp={props.round.votingStart} short={short} />
				</p>
				<p className="w-full text-right whitespace-nowrap">
					<DateComponent timestamp={props.round.end} short={short} />
				</p>
			</div>
		</div>
	);
}

function Completed() {
	return (
		<div className="rounded-full flex items-center justify-center h-8 w-8 bg-green flex-shrink-0 ">
			<Check className="h-4 w-4 text-white" />
		</div>
	);
}

function Active() {
	return (
		<div className="rounded-full bg-blue-700 flex items-center justify-center h-8 w-8 flex-shrink-0">
			<Timer className="h-4 w-4 text-white" />
		</div>
	);
}

function Upcoming() {
	return (
		<div className="rounded-full border-2 border-grey-500 border-dotted h-8 w-8 flex-shrink-0" />
	);
}
