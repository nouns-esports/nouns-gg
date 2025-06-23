import { getAuthenticatedUser } from "@/server/queries/users";
import { getPredictions } from "@/server/queries/predictions";
import PredictionCard from "@/components/PredictionCard";
import Refresh from "@/components/Refresh";

export default async function Predictions() {
	const user = await getAuthenticatedUser();

	const predictions = await getPredictions({
		user: user?.id,
		limit: 50,
	});

	return (
		<div className="flex flex-col w-full items-center">
			<div className="flex flex-col h-full gap-6 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 max-w-[1920px]">
				<div className="flex items-center justify-between w-full">
					<h1 className="font-luckiest-guy text-white text-3xl">Predictions</h1>
				</div>
				<div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-md:flex max-md:flex-col gap-4">
					{predictions.map((prediction) => (
						<PredictionCard
							key={`prediction-${prediction.id}`}
							prediction={prediction}
							className="max-md:w-full max-md:flex-shrink-0"
						/>
					))}
				</div>
			</div>
			<Refresh />
		</div>
	);
}
