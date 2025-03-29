import Button from "@/components/Button";
import QuestCard from "@/components/QuestCard";
import { getFeaturedEvent } from "@/server/queries/events";
import { getAuthenticatedUser } from "@/server/queries/users";
import { getQuests } from "@/server/queries/quests";

export default async function Quests() {
	const [user, featuredEvent] = await Promise.all([
		getAuthenticatedUser(),
		getFeaturedEvent(),
	]);

	const quests = await getQuests({
		user: user?.id,
	});

	const featuredQuests = quests.filter((quest) => quest.featured);
	const allQuests = quests.filter((quest) => !quest.featured);

	return (
		<div className="flex flex-col h-full gap-8 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
			{featuredEvent && (
				<div className="relative w-full aspect-[3/1] max-sm:aspect-auto max-md:h-64 max-sm:h-48 rounded-xl overflow-hidden">
					<img
						alt={featuredEvent.name}
						src={featuredEvent.image}
						className="w-full h-full object-cover brightness-75"
					/>
					<h2 className="absolute top-4 left-4 text-white text-4xl font-luckiest-guy max-md:text-3xl">
						{featuredEvent.name}
					</h2>
					<div className="absolute bottom-4 left-4">
						<Button href={`/events/${featuredEvent.handle}`}>View Event</Button>
					</div>
				</div>
			)}
			{!featuredEvent && featuredQuests.length > 0 && (
				<div className="flex flex-col gap-6">
					<div className="flex items-center justify-between w-full">
						<h1 className="font-luckiest-guy text-white text-3xl">Featured</h1>
					</div>
					<div className="grid grid-cols-5 max-2xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-[550px]:flex max-[550px]:overflow-x-scroll max-[550px]:scrollbar-hidden gap-4">
						{featuredQuests.map((quest) => (
							<QuestCard
								key={`quest-${quest.id}`}
								handle={quest.handle}
								name={quest.name}
								description={quest.description}
								image={quest.image}
								community={
									quest.community
										? {
												handle: quest.community.handle,
												name: quest.community.name,
												image: quest.community.image,
											}
										: undefined
								}
								xp={quest.xp}
								completed={!!(quest.completed?.length > 0)}
								start={quest.start ?? undefined}
								end={quest.end ?? undefined}
								className="max-[550px]:w-64 max-[550px]:flex-shrink-0"
							/>
						))}
					</div>
				</div>
			)}
			<div className="flex flex-col gap-6">
				<div className="flex items-center justify-between w-full">
					<h1 className="font-luckiest-guy text-white text-3xl">Quests</h1>
					{user?.nexus?.admin ? (
						<Button href="/quests/create">Create</Button>
					) : null}
				</div>
				<div className="grid grid-cols-5 max-2xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-[550px]:flex max-[550px]:overflow-x-scroll max-[550px]:scrollbar-hidden gap-4">
					{allQuests.map((quest) => (
						<QuestCard
							key={`quest-${quest.id}`}
							handle={quest.handle}
							name={quest.name}
							description={quest.description}
							image={quest.image}
							community={
								quest.community
									? {
											handle: quest.community.handle,
											name: quest.community.name,
											image: quest.community.image,
										}
									: undefined
							}
							xp={quest.xp}
							completed={!!(quest.completed?.length > 0)}
							start={quest.start ?? undefined}
							end={quest.end ?? undefined}
							className="max-[550px]:w-64 max-[550px]:flex-shrink-0"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
