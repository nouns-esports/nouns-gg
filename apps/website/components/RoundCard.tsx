import Link from "./Link";
import { Timer } from "lucide-react";
import { roundState } from "@/utils/roundState";
import Countdown from "@/components/Countdown";
import { twMerge } from "tailwind-merge";
import Image from "./Image";

export default function RoundCard(props: {
	id: string;
	image: string;
	name: string;
	start: Date | string;
	votingStart: Date | string;
	end: Date | string;
	community?: {
		id: string;
		name: string;
		image: string;
	};
	className?: string;
}) {
	const state = roundState({
		start: props.start,
		votingStart: props.votingStart,
		end: props.end,
	});

	return (
		<div
			className={twMerge(
				"relative flex flex-col bg-grey-800 hover:bg-grey-600 transition-colors rounded-xl overflow-hidden w-full group aspect-[49/50]",
				props.className,
			)}
		>
			<Link
				href={`/rounds/${props.id}`}
				className="absolute z-10 top-0 left-0 w-full h-full"
			/>
			<div className="flex flex-shrink-0 w-full h-[40%] overflow-hidden">
				{/* <img 
          src={`${props.image}?img-height=200&img-onerror=redirect`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        /> */}
				<Image
					hash={props.image.split("/ipfs/")[1]}
					alt={props.name}
					className="group-hover:scale-105 transition-transform"
				/>
			</div>
			<div className="flex flex-col p-4 h-full">
				<div className="flex flex-col gap-4 h-full">
					<p className="text-white text-[1.75rem] leading-tight font-bebas-neue line-clamp-2">
						{props.name}
					</p>
					<div className="w-full text-sm flex items-center gap-4 text-white">
						<div className="flex gap-1.5">
							<Timer className="w-4 h-4 text-grey-200" />
							<p className="mt-[1px] leading-none text-grey-200">
								{state === "Upcoming" ? "Round starts" : ""}
								{state === "Proposing" ? "Voting starts" : ""}
								{state === "Voting" ? "Round ends" : ""}
								{state === "Ended" ? "Round ended" : ""}
							</p>
						</div>
						{state === "Ended" ? (
							new Intl.DateTimeFormat("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							}).format(new Date(props.end))
						) : (
							<Countdown
								date={
									state === "Upcoming"
										? new Date(props.start)
										: state === "Proposing"
											? new Date(props.votingStart)
											: new Date(props.end)
								}
							/>
						)}
					</div>
				</div>
				<div className="flex h-full items-end">
					<Link
						href={`https://warpcast.com/~/channel/${props.community?.id ?? "nouns-esports"}`}
						newTab
						className="relative z-20 bg-grey-500 hover:bg-grey-400 transition-colors py-2 pl-2 pr-3 rounded-full flex text-white items-center gap-2 text-sm font-semibold w-fit"
					>
						<img
							src={props.community?.image ?? "/logo/logo-square.png"}
							className="w-5 h-5 rounded-full"
						/>
						{props.community?.name ?? "Nouns Esports"}
					</Link>
				</div>
			</div>
		</div>
	);
}
