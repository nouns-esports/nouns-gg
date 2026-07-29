import { getPrediction } from "@/server/queries/predictions";
import { isUUID } from "@/utils/isUUID";
import { notFound, redirect } from "next/navigation";
import { predictionParams } from "@/server/data/params";

export function generateStaticParams() {
	return predictionParams.map(({ prediction }) => ({ prediction }));
}

export default async function Prediction(props: {
	params: Promise<{ prediction: string }>;
}) {
	const params = await props.params;

	if (isUUID(params.prediction)) {
		const prediction = await getPrediction({ id: params.prediction });

		if (!prediction) {
			return notFound();
		}

		return redirect(
			`/c/${prediction.community.handle}/predictions/${prediction.handle}`,
		);
	}

	const prediction = await getPrediction({ handle: params.prediction });

	if (!prediction) {
		return notFound();
	}

	return redirect(
		`/c/${prediction.community.handle}/predictions/${prediction.handle}`,
	);
}
