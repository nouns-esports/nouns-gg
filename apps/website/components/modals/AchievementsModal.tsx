import { Sparkles, X } from "lucide-react";
import { Modal, ToggleModal } from "../Modal";
import type { AuthenticatedUser } from "@/server/queries/users";
import type { getAchievementsProgress } from "@/server/queries/achievements";
import DateComponent from "../Date";
import ProgressCircle from "../ProgressCircle";
import Achievements from "../Achievements";

export default function AchievementsModal(props: {
	user: AuthenticatedUser;
	achievementProgress: Awaited<ReturnType<typeof getAchievementsProgress>>;
}) {
	const completed = Object.values(props.achievementProgress).filter(
		(value) => value === "claimed",
	).length;

	return (
		<Modal
			id="achievements"
			className="p-4 flex flex-col max-w-[700px] w-full gap-4"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Achievements
				</p>
				<ToggleModal
					id="achievements"
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>

			<div className="bg-grey-800 relative rounded-xl flex flex-col gap-4 p-4 h-[400px] col-span-2 max-lg:col-span-4">
				<div className="flex items-center justify-between">
					{/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
					<p className="text-white text-2xl font-bebas-neue leading-none"></p>
					<div className="flex items-center gap-3">
						<p className="text-white">
							{completed}/{Object.keys(props.achievementProgress).length}{" "}
							Completed
						</p>
						<ProgressCircle
							value={completed}
							min={0}
							size={24}
							max={Object.keys(props.achievementProgress).length}
						/>
					</div>
				</div>
				<div className="bg-grey-600 rounded-xl relative w-full h-full overflow-hidden">
					<Achievements
						user={props.user}
						achievementProgress={props.achievementProgress}
					/>
				</div>
			</div>
		</Modal>
	);
}
