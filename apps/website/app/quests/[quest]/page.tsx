import CheckQuest from "@/components/CheckQuest";
import Link from "@/components/Link";
import NavigateBack from "@/components/NavigateBack";
import TipTap from "@/components/TipTap";
import { getAction } from "@/server/actions";
import { getQuest } from "@/server/queries/quests";
import { getAuthenticatedUser } from "@/server/queries/users";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";

export async function generateMetadata(props: {
	params: Promise<{ quest: string }>;
}): Promise<Metadata> {
	const params = await props.params;

	const quest = await getQuest({ handle: params.quest });

	if (!quest) {
		return notFound();
	}

	return {
		title: quest.name,
		description: null,
		metadataBase: new URL(env.NEXT_PUBLIC_DOMAIN),
		openGraph: {
			type: "website",
			images: [quest.image],
		},
		twitter: {
			site: "@NounsEsports",
			card: "summary_large_image",
			images: [quest.image],
		},
		other: {
			"fc:frame": JSON.stringify({
				version: "next",
				imageUrl: quest.image,
				button: {
					title: "View Quest",
					action: {
						type: "launch_frame",
						name: "Nouns GG",
						url: `${env.NEXT_PUBLIC_DOMAIN}/quests/${quest.handle}`,
						splashImageUrl:
							"https://ipfs.nouns.gg/ipfs/bafkreia2vysupa4ctmftg5ro73igggkq4fzgqjfjqdafntylwlnfclziey",
						splashBackgroundColor: "#040404",
					},
				},
			}),
		},
	};
}

export default async function Quest(props: {
	params: Promise<{ quest: string }>;
}) {
	const params = await props.params;
	const user = await getAuthenticatedUser();

	const quest = await getQuest({ handle: params.quest, user: user?.id });

	if (!quest) {
		return notFound();
	}

	const questClaimed = quest.completions.length > 0;

	const actions = await Promise.all(
		quest.actions.map(async (actionState) => {
			const action = await getAction({ action: actionState.action });

			if (!action) {
				throw new Error(`Action ${actionState.action} not found`);
			}

			return {
				...actionState,
				completed: user
					? await action.check({
							user,
							inputs: actionState.inputs,
						})
					: false,
			};
		}),
	);

	const allCompleted = actions.every((action) => action.completed);

	return (
		<div className="relative flex justify-center gap-16 w-full pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
			<div className="flex flex-col gap-4 w-full max-w-3xl">
				<NavigateBack
					fallback={quest.event ? `/events/${quest.event.handle}` : "/quests"}
					className="text-red flex items-center gap-1 group w-fit"
				>
					<ArrowLeft className="w-5 h-5 text-red group-hover:-translate-x-1 transition-transform" />
					Back
				</NavigateBack>
				<div className="flex flex-col gap-4">
					<div className="bg-grey-800 rounded-xl overflow-hidden">
						<img
							alt={quest.name}
							src={quest.image}
							className="w-full h-48 object-cover object-center max-sm:h-32"
						/>
						<div className="flex flex-col gap-8 p-4">
							<div className="flex flex-col gap-2">
								<h1 className="w-full text-white font-luckiest-guy text-3xl">
									{quest.name}
								</h1>
								{quest.description ? (
									<TipTap content={quest.description} />
								) : null}
							</div>
							<div className="flex flex-col gap-4">
								<div className="flex gap-8 items-center justify-between">
									<h2 className="font-bebas-neue text-white text-2xl">
										{quest.active && quest.actions?.length > 0
											? user
												? questClaimed
													? "Quest completed"
													: allCompleted
														? "All actions completed"
														: "Complete all of the following"
												: "Enter the Nexus to complete quests"
											: "Quest is not active"}
									</h2>
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-2 text-white">
											Earns <Sparkles className="w-4 h-4 text-green" />
											{quest.xp}
										</div>
										<CheckQuest
											user={!!user?.nexus}
											active={quest.active && quest.actions?.length > 0}
											quest={quest.id}
											xp={quest.xp}
											userXP={user?.nexus?.xp ?? 0}
											completed={allCompleted || questClaimed}
											claimed={questClaimed}
										/>
									</div>
								</div>
								<ul className="flex flex-col gap-2">
									{actions.map(async (action, index) => (
										<li
											key={`action-${index}`}
											className={twMerge(
												"relative bg-grey-600 rounded-xl p-3 flex gap-4 items-center text-white",
												(action.completed || !quest.active || questClaimed) &&
													"opacity-60 pointer-events-none",
											)}
										>
											{action.completed || questClaimed ? (
												<div className="rounded-full bg-green w-7 h-7 flex items-center justify-center">
													<Check className="w-5 h-5 text-black/50" />
												</div>
											) : (
												<div className="rounded-full bg-black/60 h-7 w-7 flex items-center justify-center text-sm">
													{index + 1}
												</div>
											)}
											<div className="flex items-center gap-2">
												{action.description.map((part, index) => {
													const highlighed = part.highlight ?? !!part.href;
													const Component = part.href ? Link : "p";

													return (
														<Component
															key={`part-${index}`}
															// @ts-ignore
															href={part.href}
															newTab={!!part.href}
															className={twMerge(
																"text-white",
																part.href &&
																	"cursor-pointer hover:bg-grey-400 transition-colors",
																highlighed &&
																	"px-2 py-0.5 rounded-md bg-grey-500 ",
															)}
														>
															{part.text}
														</Component>
													);
												})}
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
