import { db } from "~/packages/db";
import { predictions } from "~/packages/db/schema/public";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function StreamPage(props: {
	params: Promise<{ prediction: string; index: string }>;
}) {
	const params = await props.params;

	console.log(params);

	const prediction = await db.pgpool.query.predictions.findFirst({
		where: eq(predictions.handle, params.prediction),
		with: {
			outcomes: true,
		},
	});

	if (
		!prediction ||
		parseInt(params.index) < 1 ||
		prediction.outcomes.length < parseInt(params.index)
	) {
		return notFound();
	}

	const outcomes = prediction.outcomes.toSorted((a, b) => {
		const aName = a.name.toLowerCase();
		const bName = b.name.toLowerCase();

		if (aName === "yes") return -1;
		if (bName === "yes") return 1;
		if (aName === "no") return -1;
		if (bName === "no") return 1;

		const poolDiff = Number(b.pool) - Number(a.pool);
		if (poolDiff !== 0) return poolDiff;

		const aNumber = parseInt(aName);
		const bNumber = parseInt(bName);

		if (!Number.isNaN(aNumber) && !Number.isNaN(bNumber)) {
			return aNumber - bNumber;
		}

		return aName.localeCompare(bName);
	});

	const outcome = outcomes[parseInt(params.index) - 1];

	const odds = Number(
		((Number(outcome.pool) / Number(prediction.pool)) * 100).toFixed(0),
	);

	const binary = outcomes.length === 2;

	return (
		<div className="z-[1000000] bg-[#0F0F0F] fixed w-screen h-screen overflow-hidden scrollbar-hidden text-white">
			{binary ? (
				<>
					<div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end h-full">
						<div
							className="w-full bg-gold-500"
							style={{
								height: `${odds === 0 ? 1 : odds === 100 ? 99 : odds}%`,
							}}
						/>
					</div>
					<div className="absolute bottom-[10vh] left-0 w-full flex flex-col items-center justify-end h-full">
						<p
							className="font-londrina-solid"
							style={{ fontSize: "30vw", lineHeight: 1 }}
						>
							{odds === 0 ? 1 : odds === 100 ? 99 : odds}%
						</p>
					</div>
				</>
			) : (
				<div className="w-full h-full flex items-center justify-between px-[20vh]">
					<p
						className="font-londrina-solid text-nowrap text-[#FFFFFF]"
						style={{ fontSize: "30vh", lineHeight: 1 }}
					>
						{outcome.name}
					</p>
					<p
						className="font-londrina-solid text-[#FED439]"
						style={{ fontSize: "30vh", lineHeight: 1 }}
					>
						{odds === 0 ? 1 : odds === 100 ? 99 : odds}%
					</p>
				</div>
			)}
		</div>
	);
}
