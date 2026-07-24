import { siteConfig } from "@/config";
import NavigateBack from "@/components/NavigateBack";
import TipTap from "@/components/TipTap";
import Button from "@/components/Button";
import { getPrediction } from "@/server/queries/predictions";
import { isUUID } from "@/utils/isUUID";
import { parsePrediction } from "~/packages/utils/parsePrediction";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { predictionParams } from "@/server/data/params";
import { twMerge } from "tailwind-merge";

export function generateStaticParams() {
	return predictionParams;
}

async function findPrediction(params: {
	prediction: string;
	community: string;
}) {
	return isUUID(params.prediction)
		? getPrediction({ id: params.prediction })
		: getPrediction({
				handle: params.prediction,
				community: params.community,
			});
}

export async function generateMetadata(props: {
	params: Promise<{ prediction: string; community: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const prediction = await findPrediction(params);
	if (!prediction) return notFound();
	return {
		title: prediction.name,
		metadataBase: new URL(siteConfig.domain),
		openGraph: { type: "website", images: [prediction.image] },
		twitter: {
			site: "@NounsEsports",
			card: "summary_large_image",
			images: [prediction.image],
		},
	};
}

export default async function Prediction(props: {
	params: Promise<{ prediction: string; community: string }>;
}) {
	const params = await props.params;
	const prediction = await findPrediction(params);
	if (!prediction) return notFound();
	const { state, outcomes } = parsePrediction(prediction);

	return (
		<div className="relative flex w-full justify-center px-32 pt-32 max-2xl:px-16 max-xl:px-8 max-xl:pt-28 max-sm:px-4 max-sm:pt-20">
			<div className="flex w-full max-w-3xl flex-col gap-4">
				<NavigateBack
					fallback={
						prediction.event
							? `/events/${prediction.event.handle}`
							: "/predictions"
					}
					className="group flex w-fit items-center gap-1 text-red"
				>
					<ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
					Back
				</NavigateBack>
				<article className="flex w-full flex-col gap-4 overflow-hidden rounded-xl bg-grey-800 p-4">
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between gap-8">
							<div className="flex items-center gap-4">
								<img
									alt={prediction.name}
									src={prediction.image}
									className="h-16 w-16 rounded-lg object-cover object-center max-sm:h-12 max-sm:w-12"
								/>
								<h1 className="w-full font-luckiest-guy text-2xl text-white max-md:text-xl max-sm:text-lg">
									{prediction.name}
								</h1>
							</div>
							<div
								className="flex h-min items-center gap-1.5 whitespace-nowrap rounded-full bg-green/30 px-3 py-1 text-sm text-green"
							>
								Finalized
							</div>
						</div>
						{prediction.rules ? (
							<TipTap
								content={prediction.rules}
								className="flex flex-col prose-p:leading-snug"
							/>
						) : null}
					</div>
					<div className="flex items-center justify-between gap-8">
						<h2 className="font-bebas-neue text-2xl text-white">Results</h2>
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2 text-white">
								Earns <Sparkles className="h-4 w-4 text-green" />
								{prediction.xp.winning}
							</div>
							<Button disabled size="sm">
								Predict
							</Button>
						</div>
					</div>
					<ul className="flex w-full flex-col gap-2">
						{outcomes.map((outcome) => (
							<li
								key={outcome.id}
								className="group relative flex w-full items-center justify-between gap-8 rounded-xl bg-grey-600 px-4 py-3 text-white"
							>
								<p
									className={twMerge(
										"flex items-center gap-1.5 whitespace-nowrap text-white",
										state === "resolved" && outcome.result && "text-green",
									)}
								>
									{outcome.result ? <Check className="h-4 w-4" /> : null}
									{outcome.name}
								</p>
								<div className="flex w-full items-center justify-end gap-2">
									<div
										style={{ width: `${Math.max(2, outcome.odds)}%` }}
										className={twMerge(
											"h-3 rounded-full bg-grey-500",
											state === "resolved" && outcome.result && "bg-green",
										)}
									/>
									<p className="text-sm text-white">{outcome.odds.toFixed(2)}%</p>
								</div>
							</li>
						))}
					</ul>
				</article>
			</div>
		</div>
	);
}
