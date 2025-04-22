import { twMerge } from "tailwind-merge";
import Link from "./Link";
import { Check, Sparkles, Timer } from "lucide-react";
import type { getQuests } from "@/server/queries/quests";

export default function QuestCard(props: {
	quest: NonNullable<Awaited<ReturnType<typeof getQuests>>>[number];
	className?: string;
}) {
	const now = new Date();

	const active =
		props.quest.start && props.quest.end
			? new Date(props.quest.start) < now && new Date(props.quest.end) > now
			: true;

	const completed = props.quest.completions?.length > 0;
	return (
		<div
			className={twMerge(
				"relative flex flex-col bg-grey-800 hover:bg-grey-600 transition-colors rounded-xl overflow-hidden w-full group aspect-[5/6]",
				active ? "opacity-100" : "opacity-30 pointer-events-none",
				props.className,
			)}
		>
			<Link
				href={`/quests/${props.quest.handle}`}
				className="absolute z-10 top-0 left-0 w-full h-full"
			/>
			<div className="flex flex-shrink-0 w-full h-[40%] overflow-hidden">
				<img
					alt={props.quest.name}
					src={`${props.quest.image}?img-height=200&img-onerror=redirect`}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform"
				/>
			</div>
			<div className="flex flex-col justify-between p-4 gap-4 h-full">
				<div className="flex flex-col gap-4">
					<p className="text-white text-2xl leading-tight font-bebas-neue line-clamp-2 h-[2lh]">
						{props.quest.name}
					</p>
				</div>
				<div className="flex justify-between items-center">
					{props.quest.community && !props.quest.event ? (
						<Link
							href={`/c/${props.quest.community.handle}`}
							className="relative z-20 bg-grey-500 hover:bg-grey-400 transition-colors py-2 pl-2 pr-3 rounded-full flex text-white items-center gap-2 text-sm font-semibold w-fit max-w-36"
						>
							<img
								alt={props.quest.community.name}
								src={props.quest.community.image}
								className="w-5 h-5 rounded-full object-cover"
							/>
							<p className="text-white truncate">
								{props.quest.community.name}
							</p>
						</Link>
					) : null}
					{props.quest.event ? (
						<Link
							href={`/events/${props.quest.event.handle}`}
							className="relative z-20 bg-grey-500 hover:bg-grey-400 transition-colors py-2 pl-2 pr-3 rounded-full flex text-white items-center gap-2 text-sm font-semibold w-fit max-w-36"
						>
							<img
								alt={props.quest.event.name}
								src={props.quest.event.image}
								className="w-5 h-5 rounded-full object-cover"
							/>
							<p className="text-white truncate">{props.quest.event.name}</p>
						</Link>
					) : null}

					{completed ? (
						<div className="font-semibold text-sm flex items-center gap-1 text-green mr-2">
							<Check className="w-4 h-4" />
							Done
						</div>
					) : (
						<div className="text-white font-semibold text-sm flex items-center gap-2 mr-2">
							<Sparkles className="w-4 h-4 text-green" />
							{props.quest.xp}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
