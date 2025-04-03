import { getPrediction } from "@/server/queries/predictions";
import { ImageResponse } from "next/og";
import fs from "fs";
import { join } from "path";

export async function GET(request: Request) {
	const url = new URL(request.url);

	const params = {
		prediction: url.searchParams.get("prediction"),
		user: url.searchParams.get("user"),
	};

	if (!params.prediction) {
		return Response.json({ error: "Prediction is required" }, { status: 400 });
	}

	const prediction = await getPrediction({
		handle: params.prediction,
		user: params.user ?? undefined,
	});

	if (!prediction) {
		return Response.json({ error: "Prediction not found" }, { status: 404 });
	}

	return new ImageResponse(
		<div
			style={{
				width: 1200,
				height: 800,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				gap: 24,
				border: "1px solid #1F1F1F",
				background:
					"linear-gradient(to bottom right, rgba(13,7,35,1), rgba(45,9,9,1))",
				padding: 56,
			}}
		>
			Test
		</div>,
		{
			width: 1200,
			height: 800,
			fonts: [
				{
					name: "Cabin",
					data: fs.readFileSync(
						join(process.cwd(), "./public/fonts/Cabin-Regular.ttf"),
					),
					weight: 400,
					style: "normal",
				},
				{
					name: "Luckiest Guy",
					data: fs.readFileSync(
						join(process.cwd(), "./public/fonts/LuckiestGuy-Regular.ttf"),
					),
					weight: 400,
					style: "normal",
				},
				{
					name: "Bebas Neue",
					data: fs.readFileSync(
						join(process.cwd(), "./public/fonts/BebasNeue-Regular.ttf"),
					),
					weight: 400,
					style: "normal",
				},
				{
					name: "Londrina Solid",
					data: fs.readFileSync(
						join(process.cwd(), "./public/fonts/LondrinaSolid-Regular.ttf"),
					),
					weight: 400,
					style: "normal",
				},
			],
		},
	);
}
