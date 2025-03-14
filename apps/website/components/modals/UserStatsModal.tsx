import { Sparkles, X } from "lucide-react";
import { Modal, ToggleModal } from "../Modal";
import type { nexus } from "~/packages/db/schema/public";
import type { getUserStats } from "@/server/queries/users";
import DateComponent from "../Date";

export default function UserStatsModal(props: {
	user: typeof nexus.$inferSelect;
	stats: Awaited<ReturnType<typeof getUserStats>>;
}) {
	return (
		<Modal
			id="user-stats"
			className="p-4 flex flex-col max-w-[400px] w-full gap-4"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					{props.user.name}'s Stats
				</p>
				<ToggleModal
					id="user-stats"
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>

			<div className="flex bg-grey-800 rounded-xl flex-col gap-2 px-4 py-3">
				<div className="flex justify-between items-center gap-2">
					<p className="">All Time XP</p>
					<p className="text-white flex items-center gap-2">
						<Sparkles className="w-4 h-4 text-green" />
						{props.user.xp}
					</p>
				</div>
				<div className="flex justify-between items-center gap-2">
					<p className="">Votes Cast</p>
					<p className="text-white">{props.stats.votesCast}</p>
				</div>
				<div className="flex justify-between items-center gap-2">
					<p className="">Proposals Created</p>
					<p className="text-white">{props.stats.proposalsCreated}</p>
				</div>
				<div className="flex justify-between items-center gap-2">
					<p className="">Quests Completed</p>
					<p className="text-white">{props.stats.questsCompleted}</p>
				</div>
			</div>

			<div className="flex justify-between items-center">
				<p>Last updated on</p>
				<p className="text-white whitespace-nowrap">
					<DateComponent format="%monthLong %day%ordinal, %year" />
				</p>
			</div>
		</Modal>
	);
}
