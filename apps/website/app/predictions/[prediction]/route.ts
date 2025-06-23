import { getPrediction } from "@/server/queries/predictions";
import { isUUID } from "@/utils/isUUID";
import { notFound, redirect } from "next/navigation";

export async function GET(props: { params: Promise<{ prediction: string }> }) {
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
