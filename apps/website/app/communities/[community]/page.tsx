import Link from "@/components/Link";
import { notFound } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { getCommunity } from "@/server/queries/communities";
import PredictionCard from "@/components/PredictionCard";
import QuestCard from "@/components/QuestCard";
import RoundCard from "@/components/RoundCard";
import { getRounds } from "@/server/queries/rounds";
import { getQuests } from "@/server/queries/quests";
import { getPredictions } from "@/server/queries/predictions";
import { getAuthenticatedUser } from "@/server/queries/users";

export default async function Community(props: {
	params: Promise<{ community: string }>;
	searchParams: Promise<{
		tab?: "rounds" | "quests" | "predictions";
	}>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;

	const [community, user] = await Promise.all([
		getCommunity({ handle: params.community }),
		getAuthenticatedUser(),
	]);

	if (!community) {
		return notFound();
	}

	const tab =
		searchParams.tab ??
		(community.hasRounds
			? "rounds"
			: community.hasQuests
				? "quests"
				: community.hasPredictions
					? "predictions"
					: null);

	const rounds =
		tab === "rounds" ? await getRounds({ community: community.id }) : [];
	const quests =
		tab === "quests" ? await getQuests({ community: community.id }) : [];
	const predictions =
		tab === "predictions"
			? await getPredictions({ community: community.id })
			: [];

	return (
		<div className="flex flex-col w-full items-center">
			<div className="relative flex flex-col justify-center gap-8 w-full pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 max-w-[1920px]">
				<div className="px-4 pt-4 flex flex-col gap-4 bg-grey-800 rounded-xl">
					<div className="flex items-center gap-4">
						<img
							src={community.image}
							alt={community.name}
							className=" h-12 w-12 object-cover object-center max-sm:h-32 rounded-md"
						/>
						<h1 className="text-white text-2xl font-luckiest-guy">
							{community.name}
						</h1>
					</div>
					{tab ? (
						<ul className="flex gap-2 w-full overflow-x-auto">
							{community.hasRounds ? (
								<Tab href="?tab=rounds" active={tab === "rounds"}>
									Rounds
								</Tab>
							) : null}
							{community.hasQuests ? (
								<Tab href="?tab=quests" active={tab === "quests"}>
									Quests
								</Tab>
							) : null}
							{community.hasPredictions ? (
								<Tab href="?tab=predictions" active={tab === "predictions"}>
									Predictions
								</Tab>
							) : null}
						</ul>
					) : null}
				</div>
				<div className="flex flex-col gap-8 w-full">
					{
						{
							rounds: (
								<div className="grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
									{rounds.map((round) => (
										<RoundCard key={`round-${round.id}`} round={round} />
									))}
								</div>
							),
							quests: (
								<div className="grid grid-cols-5 max-2xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
									{quests.map((quest) => (
										<QuestCard key={`quest-${quest.id}`} quest={quest} />
									))}
								</div>
							),
							predictions: (
								<div className="flex flex-col gap-6">
									<h2 className="text-white font-luckiest-guy text-2xl">
										Happening Now
									</h2>
									<div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-md:flex max-md:flex-col gap-4">
										{predictions.map((prediction) => (
											<PredictionCard
												key={`prediction-${prediction.id}`}
												prediction={prediction}
												user={user}
												className="max-md:w-full max-md:flex-shrink-0"
											/>
										))}
									</div>
								</div>
							),
							default: null,
						}[tab ?? "default"]
					}
				</div>
			</div>
		</div>
	);
}

function Tab(props: { children: string; active: boolean; href: string }) {
	return (
		<li
			className={twMerge(
				"relative text-white font-bebas-neue px-3 text-xl hover:bg-grey-500 rounded-t-md transition-colors py-1",
				props.active && "text-red",
			)}
		>
			<Link href={props.href}>{props.children}</Link>
			{props.active ? (
				<div className="w-full h-0.5 bg-red absolute bottom-0 left-0" />
			) : null}
		</li>
	);
}
