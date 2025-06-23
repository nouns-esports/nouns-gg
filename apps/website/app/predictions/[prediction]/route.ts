import { getPrediction } from "@/server/queries/predictions";
import { isUUID } from "@/utils/isUUID";
import { notFound, redirect } from "next/navigation";

export async function GET(request: Request) {
	const url = new URL(request.url);

	const params = {
		prediction: url.searchParams.get("prediction"),
	};

	if (!params.prediction) {
		return notFound();
	}

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
