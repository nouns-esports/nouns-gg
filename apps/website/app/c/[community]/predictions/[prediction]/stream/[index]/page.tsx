import { db } from "~/packages/db";
import { predictions } from "~/packages/db/schema/public";
import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import Refresh from "@/components/Refresh";
import { parsePrediction } from "~/packages/utils/parsePrediction";

export default async function StreamPage(props: {
	params: Promise<{ prediction: string; index: string }>;
}) {
	const params = await props.params;

	const prediction = await db.pgpool.query.predictions.findFirst({
		where: eq(predictions.handle, params.prediction),
		with: {
			outcomes: {
				extras: {
					totalBets:
						sql<number>`(SELECT COUNT(*) FROM bets WHERE bets.outcome = outcomes.id)`.as(
							"totalBets",
						),
				},
			},
		},
		extras: {
			totalBets:
				sql<number>`(SELECT COUNT(*) FROM bets WHERE bets.prediction = predictions.id)`.as(
					"totalBets",
				),
		},
	});

	if (
		!prediction ||
		parseInt(params.index) < 1 ||
		prediction.outcomes.length < parseInt(params.index)
	) {
		return notFound();
	}

	const { outcomes, binary } = parsePrediction(prediction);

	const outcome = outcomes[parseInt(params.index) - 1];

	return (
		<>
			<Refresh />
			<style
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: `
			  html, body { overflow: hidden !important; }
			`,
				}}
			/>
			<div className="z-[1000000] bg-[#0F0F0F] fixed w-screen h-screen overflow-hidden scrollbar-hidden text-white">
				{binary ? (
					<>
						<div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end h-full">
							<div
								className="w-full bg-gold-500"
								style={{
									height: `${outcome.odds === 0 ? 1 : outcome.odds === 100 ? 99 : outcome.odds}%`,
								}}
							/>
						</div>
						<div className="absolute bottom-[10vh] left-0 w-full flex flex-col items-center justify-end h-full">
							<p
								className="font-londrina-solid"
								style={{ fontSize: "30vw", lineHeight: 1 }}
							>
								{outcome.odds === 0
									? 1
									: outcome.odds === 100
										? 99
										: outcome.odds}
								%
							</p>
						</div>
					</>
				) : (
					<div className="w-full h-full flex items-center justify-between px-[20vh]">
						<p
							className="font-londrina-solid text-nowrap text-[#FFFFFF]"
							style={{ fontSize: "36vh", lineHeight: 1 }}
						>
							{outcome.name}
						</p>
						<p
							className="font-londrina-solid text-[#FED439]"
							style={{ fontSize: "36vh", lineHeight: 1 }}
						>
							{outcome.odds === 0
								? 1
								: outcome.odds === 100
									? 99
									: outcome.odds}
							%
						</p>
					</div>
				)}
			</div>
		</>
	);
}
