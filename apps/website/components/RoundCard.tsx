import Link from "./Link";
import { Timer } from "lucide-react";
import { roundState } from "@/utils/roundState";
import Countdown from "@/components/Countdown";
import { twMerge } from "tailwind-merge";
import Image from "./Image";
import type { getRounds } from "@/server/queries/rounds";

export default function RoundCard(props: {
	round: NonNullable<Awaited<ReturnType<typeof getRounds>>>[number];
	className?: string;
}) {
	const state = roundState({
		start: props.round.start,
		votingStart: props.round.votingStart,
		end: props.round.end,
	});

	return (
		<div
			className={twMerge(
				"relative flex flex-col bg-grey-800 hover:bg-grey-600 transition-colors rounded-xl overflow-hidden w-full group aspect-[49/50]",
				props.className,
			)}
		>
			<Link
				href={`/c/${props.round.community.handle}/rounds/${props.round.handle}`}
				className="absolute z-10 top-0 left-0 w-full h-full"
			/>
			<div className="flex flex-shrink-0 w-full h-[40%] overflow-hidden">
				{/* <img 
          src={`${props.image}?img-height=200&img-onerror=redirect`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        /> */}
				<Image
					hash={props.round.image.split("/ipfs/")[1]}
					alt={props.round.name}
					className="group-hover:scale-105 transition-transform"
				/>
			</div>
			<div className="flex flex-col p-4 h-full">
				<div className="flex flex-col gap-4 h-full">
					<p className="text-white text-[1.75rem] leading-tight font-bebas-neue line-clamp-2">
						{props.round.name}
					</p>
					<div className="w-full text-sm flex items-center gap-4 text-white">
						<div className="flex gap-1.5">
							<Timer className="w-4 h-4 text-grey-200" />
							<p className="mt-[1px] leading-none text-grey-200">
								{state === "Upcoming" ? "Round starts" : ""}
								{state === "Proposing" ? "Voting starts" : ""}
								{state === "Voting" ? "Voting ends" : ""}
								{state === "Ended" ? "Round ended" : ""}
							</p>
						</div>
						{state === "Ended" ? (
							new Intl.DateTimeFormat("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							}).format(new Date(props.round.end))
						) : (
							<Countdown
								date={
									state === "Upcoming"
										? new Date(props.round.start)
										: state === "Proposing"
											? new Date(props.round.votingStart)
											: new Date(props.round.end)
								}
							/>
						)}
					</div>
				</div>
				{props.round.community && !props.round.event ? (
					<div className="flex h-full items-end">
						<Link
							href={`/c/${props.round.community.handle}`}
							className="relative z-20 bg-grey-500 hover:bg-grey-400 transition-colors py-2 pl-2 pr-3 rounded-full flex text-white items-center gap-2 text-sm font-semibold w-fit max-w-36"
						>
							<img
								src={props.round.community.image}
								className="w-5 h-5 rounded-full object-cover"
							/>
							<p className="text-white truncate">
								{props.round.community.name}
							</p>
						</Link>
					</div>
				) : null}
				{props.round.event ? (
					<div className="flex h-full items-end">
						<Link
							href={`/c/${props.round.event.community.handle}/events/${props.round.event.handle}`}
							className="relative z-20 bg-grey-500 hover:bg-grey-400 transition-colors py-2 pl-2 pr-3 rounded-full flex  items-center gap-2 text-sm font-semibold w-fit max-w-36"
						>
							<img
								src={props.round.event.image}
								className="w-5 h-5 rounded-full object-cover"
							/>
							<p className="text-white truncate">{props.round.event.name}</p>
						</Link>
					</div>
				) : null}
			</div>
		</div>
	);
}
