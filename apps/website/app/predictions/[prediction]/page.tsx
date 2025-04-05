import Button from "@/components/Button";
import { ToggleModal } from "@/components/Modal";
import PlaceBetModal from "@/components/modals/PlaceBetModal";
import NavigateBack from "@/components/NavigateBack";
import TipTap from "@/components/TipTap";
import { getPrediction } from "@/server/queries/predictions";
import {
	getAuthenticatedUser,
	type AuthenticatedUser,
} from "@/server/queries/users";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";
import { getPredictionOdds } from "~/packages/utils/getPredictionOdds";

export async function generateMetadata(props: {
	params: Promise<{ prediction: string }>;
}): Promise<Metadata> {
	const params = await props.params;

	const prediction = await getPrediction({ handle: params.prediction });

	if (!prediction) {
		return notFound();
	}

	return {
		title: prediction.name,
		description: null,
		metadataBase: new URL(env.NEXT_PUBLIC_DOMAIN),
		openGraph: {
			type: "website",
			images: [prediction.image],
		},
		twitter: {
			site: "@NounsEsports",
			card: "summary_large_image",
			images: [prediction.image],
		},
		other: {
			"fc:frame": JSON.stringify({
				version: "next",
				imageUrl: prediction.image,
				button: {
					title: "View Prediction",
					action: {
						type: "launch_frame",
						name: "Nouns GG",
						url: `${env.NEXT_PUBLIC_DOMAIN}/predictions/${prediction.handle}`,
						splashImageUrl:
							"https://ipfs.nouns.gg/ipfs/bafkreia2vysupa4ctmftg5ro73igggkq4fzgqjfjqdafntylwlnfclziey",
						splashBackgroundColor: "#040404",
					},
				},
			}),
		},
	};
}

export default async function Prediction(props: {
	params: Promise<{ prediction: string }>;
}) {
	const params = await props.params;
	const user = await getAuthenticatedUser();

	const prediction = await getPrediction({
		handle: params.prediction,
		user: user?.id,
	});

	if (!prediction) {
		return notFound();
	}

	return (
		<div className="relative flex justify-center gap-16 w-full pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
			<div className="flex flex-col gap-4 w-full max-w-3xl">
				<NavigateBack
					fallback={
						prediction.event
							? `/events/${prediction.event.handle}`
							: "/predictions"
					}
					className="text-red flex items-center gap-1 group w-fit"
				>
					<ArrowLeft className="w-5 h-5 text-red group-hover:-translate-x-1 transition-transform" />
					Back
				</NavigateBack>
				<div className="flex flex-col gap-4 p-4 bg-grey-800 rounded-xl overflow-hidden">
					<div className="flex flex-col gap-4">
						<div className="flex gap-4 items-center justify-between">
							<img
								alt={prediction.name}
								src={prediction.image}
								className="w-16 h-16 object-cover object-center rounded-lg"
							/>
							<h1 className="w-full text-white font-luckiest-guy text-2xl">
								{prediction.name}
							</h1>
						</div>
						<TipTap
							content={prediction.rules}
							className="flex flex-col prose-p:leading-snug"
						/>
					</div>
					<ul className={twMerge("flex flex-col gap-2")}>
						{prediction.outcomes
							.toSorted((a, b) =>
								a.name === "Yes"
									? -1
									: b.name === "Yes"
										? 1
										: a.name.localeCompare(b.name),
							)
							.map(async (outcome, index) => {
								const userBet = prediction.bets
									.filter((bet) => bet.user === user?.id)
									.find((bet) => bet.outcome.id === outcome.id);

								const userBetAmount = Number(userBet?.amount ?? 0);

								const odds = getPredictionOdds({
									prediction,
								});

								const outcomeOdds = odds.find((odd) => odd.id === outcome.id);

								return (
									<li
										key={`outcome-${outcome.id}`}
										className={twMerge(
											"relative bg-grey-600 rounded-xl py-3 px-4 flex justify-between items-center text-white",
										)}
									>
										<p>{outcome.name}</p>
										<div className="flex items-center gap-3">
											{userBetAmount > 0 ? (
												<div className="text-sm text-[#FEBD1C] font-semibold rounded-md flex items-center gap-1">
													<img
														alt="Gold coin"
														src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
														className="rounded-full h-4 w-4 shadow-xl"
													/>
													{userBetAmount}
												</div>
											) : null}
											{userBet?.outcome.id === outcome.id &&
											userBetAmount === 0 ? (
												<div className="text-sm text-green flex items-center gap-1">
													<Check className="w-4 h-4" />
													Your bet
												</div>
											) : null}
											<p className="text-sm">{outcomeOdds?.chance}%</p>

											<ToggleModal
												id={`place-bet-${prediction.id}-${outcome.id}`}
												key={`place-bet-${prediction.id}-${outcome.id}`}
												className={twMerge(
													"text-sm px-2 py-0.5 rounded-md transition-colors",
													userBet
														? "text-[#FEBD1C] bg-[#4F3101] hover:bg-[#623C00]"
														: "text-green bg-green/30 hover:bg-green/50",
												)}
											>
												{userBetAmount > 0
													? "Add"
													: userBet
														? "Bet Gold"
														: "Bet"}
											</ToggleModal>
										</div>
									</li>
								);
							})}
					</ul>
				</div>
			</div>
			{user
				? prediction.outcomes.map((outcome) => (
						<PlaceBetModal
							key={`prediction-${prediction.id}-${outcome.id}`}
							prediction={prediction}
							outcome={outcome}
							user={user}
						/>
					))
				: null}
		</div>
	);
}
