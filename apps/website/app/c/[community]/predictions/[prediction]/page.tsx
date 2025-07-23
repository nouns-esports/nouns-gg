import Button from "@/components/Button";
import { ToggleModal } from "@/components/Modal";
import MakePredictionModal from "@/components/modals/MakePredictionModal";
import NavigateBack from "@/components/NavigateBack";
import TipTap from "@/components/TipTap";
import { getPrediction } from "@/server/queries/predictions";
import {
	getAuthenticatedUser,
	type AuthenticatedUser,
} from "@/server/queries/users";
import { isUUID } from "@/utils/isUUID";
import { ArrowLeft, Check, Plus, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LockSimple } from "phosphor-react-sc";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";
import { formatGold } from "~/packages/utils/formatGold";
import { parsePrediction } from "~/packages/utils/parsePrediction";

export async function generateMetadata(props: {
	params: Promise<{ prediction: string; community: string }>;
}): Promise<Metadata> {
	const params = await props.params;

	let prediction: Awaited<ReturnType<typeof getPrediction>> | undefined;

	if (isUUID(params.prediction)) {
		prediction = await getPrediction({ id: params.prediction });
	} else {
		prediction = await getPrediction({
			handle: params.prediction,
			community: params.community,
		});
	}

	if (!prediction) {
		return notFound();
	}

	const image = `${env.NEXT_PUBLIC_DOMAIN}/api/images/predictions?prediction=${prediction.handle}`;

	return {
		title: prediction.name,
		description: null,
		metadataBase: new URL(env.NEXT_PUBLIC_DOMAIN),
		openGraph: {
			type: "website",
			images: [image],
		},
		twitter: {
			site: "@NounsEsports",
			card: "summary_large_image",
			images: [image],
		},
		other: {
			"fc:frame": JSON.stringify({
				version: "next",
				imageUrl: image,
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
	params: Promise<{ prediction: string; community: string }>;
}) {
	const params = await props.params;
	const user = await getAuthenticatedUser();

	let prediction: Awaited<ReturnType<typeof getPrediction>> | undefined;

	if (isUUID(params.prediction)) {
		prediction = await getPrediction({ id: params.prediction, user: user?.id });
	} else {
		prediction = await getPrediction({
			handle: params.prediction,
			community: params.community,
			user: user?.id,
		});
	}

	if (!prediction) {
		return notFound();
	}

	const { state, outcomes, userBet } = parsePrediction(prediction);

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
				<div className="flex flex-col gap-4 p-4 bg-grey-800 rounded-xl overflow-hidden w-full">
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between gap-8">
							<div className="flex items-center gap-4">
								<img
									alt={prediction.name}
									src={prediction.image}
									className="w-16 h-16 object-cover object-center rounded-lg max-sm:w-12 max-sm:h-12"
								/>
								<h1 className="w-full text-white font-luckiest-guy text-2xl max-md:text-xl max-sm:text-lg">
									{prediction.name}
								</h1>
							</div>
							<div
								className={twMerge(
									"flex items-center gap-1.5 px-3 py-1 h-min text-sm rounded-full bg-red/30 text-red whitespace-nowrap",
									state === "resolved" && "bg-green/30 text-green",
									state === "closed" && " bg-blue-500/30 text-blue-500",
								)}
							>
								{state === "open" ? (
									<div className="w-2 h-2 rounded-full animate-pulse bg-red" />
								) : null}
								{state === "closed" ? (
									<LockSimple
										className="w-3.5 h-3.5 text-blue-500"
										weight="fill"
									/>
								) : null}
								{
									{
										resolved: "Finalized",
										closed: "Awaiting Results",
										open: "Live",
									}[state]
								}
							</div>
						</div>
						<TipTap
							content={prediction.rules}
							className="flex flex-col prose-p:leading-snug"
						/>
					</div>
					<div className="flex gap-8 items-center justify-between">
						<h2 className="font-bebas-neue text-white text-2xl">
							{
								{
									open: "Outcomes",
									closed: "Awaiting Results",
									resolved: "Results",
								}[state]
							}
						</h2>
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2 text-white">
								Earns <Sparkles className="w-4 h-4 text-green" />
								{prediction.xp.winning}
							</div>
							<ToggleModal id="make-prediction">
								<Button disabled={state !== "open" || !!userBet} size="sm">
									Predict
								</Button>
							</ToggleModal>
						</div>
					</div>
					<ul className="flex flex-col gap-2 w-full">
						{outcomes.map((outcome) => {
							return (
								<ToggleModal
									disabled={state !== "open" || !!userBet}
									id="make-prediction"
									data={{ outcome: outcome.id }}
								>
									<li
										className={twMerge(
											"relative bg-grey-600 group gap-32 rounded-xl py-3 px-4 w-full flex justify-between items-center text-white",
											state === "open" && "hover:bg-grey-500 transition-colors",
										)}
									>
										<p
											className={twMerge(
												"flex items-center gap-1.5 text-white whitespace-nowrap",
												state === "resolved" && outcome.result && "text-green",
												state !== "resolved" &&
													userBet?.outcome.id === outcome.id &&
													"text-[#FEBD1C]",
											)}
										>
											{outcome.result ? <Check className="w-4 h-4" /> : null}
											{outcome.name}
										</p>
										<div className="flex w-full items-center justify-end gap-2">
											<div
												style={{
													width: `${outcome.odds <= 1 ? outcome.odds + 2 : outcome.odds}%`,
												}}
												className={twMerge(
													"h-3 rounded-full bg-grey-500 group-hover:bg-grey-400 transition-colors",
													state !== "resolved" &&
														userBet?.outcome.id === outcome.id &&
														"bg-[#FEBD1C] group-hover:bg-[#FEBD1C]",
													state === "resolved" &&
														outcome.result &&
														"bg-green group-hover:bg-green",
												)}
											/>
											<p className="text-white text-sm">
												{outcome.odds.toFixed(2)}%
											</p>
										</div>
									</li>
								</ToggleModal>
							);
						})}
					</ul>
					{userBet ? (
						<div className="flex gap-4 pl-1">
							{userBet.outcome.result && userBet ? (
								<>
									<div className="flex items-center gap-1">
										<p className="text-white text-sm">You predicted</p>
										<p className="text-[#FEBD1C] font-semibold text-sm">
											{userBet.outcome.name}
										</p>
										<p className="text-white text-sm">and</p>
										<p className="text-green font-semibold text-sm">won!</p>
									</div>
									{/* <div className="text-sm text-[#FEBD1C] font-semibold rounded-md flex items-center gap-1">
										<Plus className="w-3 h-3" />
										<img
											alt="Gold coin"
											src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
											className="rounded-full h-4 w-4 shadow-xl"
										/>
										{formatGold(Number(userBet.amount))}
									</div> */}
								</>
							) : null}
							{userBet.outcome.result === false ? (
								<div className="flex items-center gap-1">
									<p className="text-white text-sm">You predicted</p>
									<p className="text-[#FEBD1C] font-semibold text-sm">
										{userBet.outcome.name}
									</p>
									<p className="text-white text-sm">and</p>
									<p className="text-red font-semibold text-sm">lost</p>
								</div>
							) : null}
							{userBet.outcome.result === null ? (
								<>
									<div className="flex items-center gap-1">
										<p className="text-white text-sm">You predicted</p>
										<p className="text-[#FEBD1C] font-semibold text-sm">
											{userBet.outcome.name}
										</p>
										{/* <p className="text-white text-sm">with</p> */}
									</div>
									{/* <div className="text-sm text-[#FEBD1C] font-semibold rounded-md flex items-center gap-1">
										<img
											alt="Gold coin"
											src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
											className="rounded-full h-4 w-4 shadow-xl"
										/>
										{formatGold(Number(userBet.amount))}
									</div> */}
								</>
							) : null}
						</div>
					) : null}
				</div>
			</div>
			{user ? (
				<MakePredictionModal prediction={prediction} user={user} />
			) : null}
		</div>
	);
}
