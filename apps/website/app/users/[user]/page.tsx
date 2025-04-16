import Button from "@/components/Button";
import {
	getAuthenticatedUser,
	getUser,
	getUserStats,
} from "@/server/queries/users";
import { notFound } from "next/navigation";
import { Level } from "@/components/Level";
import SettingsModal from "@/components/modals/SettingsModal";
import { ToggleModal } from "@/components/Modal";
import { BarChart, Trophy } from "lucide-react";
import { getAchievementsProgress } from "@/server/queries/achievements";
import UserStatsModal from "@/components/modals/UserStatsModal";
import AchievementsModal from "@/components/modals/AchievementsModal";

export default async function User(props: {
	params: Promise<{ user: string }>;
}) {
	const params = await props.params;

	const [authenticatedUser, user] = await Promise.all([
		getAuthenticatedUser(),
		getUser({ user: decodeURIComponent(params.user) }),
	]);

	if (!user) {
		return notFound();
	}

	const [userStats, achievementProgress] = await Promise.all([
		getUserStats({ user: user.id }),
		authenticatedUser
			? getAchievementsProgress({ user: authenticatedUser })
			: undefined,
	]);

	return (
		<>
			<div className="flex flex-col items-center gap-16 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
				<div className="max-w-2xl w-full flex flex-col gap-4">
					<div className="flex flex-col gap-4 px-6 pt-6 pb-4 w-full rounded-xl bg-grey-800">
						<div className="flex justify-between gap-6">
							<div className="flex items-center gap-4">
								<img
									alt={user.name}
									src={user.image}
									className="w-12 h-12 rounded-full object-cover bg-white"
								/>
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-2">
										<h1 className="text-white text-2xl leading-none font-luckiest-guy">
											{user.name}
										</h1>
									</div>
									{user.bio ? <p className="line-clamp-1">{user.bio}</p> : null}
								</div>
							</div>
							<div className="flex items-center gap-4">
								<ToggleModal
									id="user-stats"
									className="flex items-center gap-1.5 text-red hover:text-red/80 transition-colors"
								>
									<BarChart className="w-4 h-4" />
									Stats
								</ToggleModal>

								{user.id === authenticatedUser?.id ? (
									<ToggleModal id="settings">
										<Button size="sm">Settings</Button>
									</ToggleModal>
								) : null}
							</div>
						</div>
						<Level xp={user.xp} />
					</div>
					{/* <div className="flex flex-col gap-4">
						<h2 className="text-white text-3xl font-luckiest-guy leading-none">
							Activity
						</h2>
						Casts, Proposals creations, votes, quest completions, etc. (with filters)
					</div> 
					*/}
				</div>
			</div>
			{authenticatedUser && <SettingsModal user={authenticatedUser} />}
			<UserStatsModal user={user} stats={userStats} />
		</>
	);
}
