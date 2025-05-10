import Button from "@/components/Button";
import QuestCard from "@/components/QuestCard";
import { getAuthenticatedUser } from "@/server/queries/users";
import { getQuests } from "@/server/queries/quests";

export default async function Quests() {
	const user = await getAuthenticatedUser();

	const quests = await getQuests({
		user: user?.id,
	});

	return (
		<div className="flex flex-col w-full items-center">
			<div className="flex flex-col h-full gap-8 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 max-w-[1920px]">
				<div className="flex items-center justify-between w-full">
					<h1 className="font-luckiest-guy text-white text-3xl">Quests</h1>
				</div>
				<div className="grid grid-cols-5 max-2xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
					{quests.map((quest) => (
						<QuestCard key={`quest-${quest.id}`} quest={quest} />
					))}
				</div>
			</div>
		</div>
	);
}
