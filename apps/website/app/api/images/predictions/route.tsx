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
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				backgroundColor: "#1A1A1A",
				padding: 48,
				justifyContent: "space-between",
				gap: 32,
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					width: "100%",
					gap: 64,
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 32 }}>
					<img
						src={prediction.image}
						style={{
							width: 120,
							height: 120,
							borderRadius: 16,
							objectFit: "cover",
							objectPosition: "center",
						}}
					/>
					<p
						style={{
							color: "white",
							fontFamily: "Bebas Neue",
							fontSize: 56,
							lineHeight: 1,
							maxWidth: 700,
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						{prediction.name}
					</p>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: 80,
						gap: 6,
						paddingLeft: 32,
						paddingRight: 32,
						fontSize: 36,
						borderRadius: 9999,
						flexShrink: 0,
						backgroundColor: prediction.resolved
							? "rgba(34, 197, 94, 0.3)"
							: prediction.closed
								? "rgba(59, 130, 246, 0.3)"
								: "rgba(239, 68, 68, 0.3)",
						color: prediction.resolved
							? "#22C55E"
							: prediction.closed
								? "#3B82F6"
								: "#EF4444",
					}}
				>
					{prediction.resolved
						? "Finalized"
						: prediction.closed
							? "Awaiting Results"
							: "Live"}
				</div>
			</div>
			<div
				style={{
					display: "flex",
					gap: 32,
					flex: 1,

					overflow: "hidden",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 32,
					}}
				>
					{prediction.outcomes
						.toSorted((a, b) => {
							const aName = a.name.toLowerCase();
							const bName = b.name.toLowerCase();
							if (aName === "yes") return -1;
							if (bName === "yes") return 1;
							if (aName === "no") return -1;
							if (bName === "no") return 1;
							return aName.localeCompare(bName);
						})
						.map((outcome) => (
							<p
								key={`outcome-left-${outcome.id}`}
								style={{
									display: "flex",
									color:
										prediction.resolved && outcome.result ? "#22C55E" : "white",
									fontSize: 36,
									height: 48,
									flexShrink: 0,
									margin: 0,
									alignItems: "center",
									whiteSpace: "nowrap",
								}}
							>
								{outcome.name}
							</p>
						))}
					{prediction.outcomes.length > 5 ? (
						<p
							style={{
								display: "flex",
								color: "#909497",
								fontSize: 24,
								height: 48,
								flexShrink: 0,
								margin: 0,
								alignItems: "center",
								whiteSpace: "nowrap",
							}}
						>
							+{(prediction.outcomes.length - 5).toString()} more
						</p>
					) : (
						""
					)}
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 32,
						flex: 1,
					}}
				>
					{prediction.outcomes
						.toSorted((a, b) => {
							const aName = a.name.toLowerCase();
							const bName = b.name.toLowerCase();
							if (aName === "yes") return -1;
							if (bName === "yes") return 1;
							if (aName === "no") return -1;
							if (bName === "no") return 1;
							return aName.localeCompare(bName);
						})
						.map((outcome) => {
							const odds = Math.ceil(
								(Number(outcome.pool) / Number(prediction.pool)) * 100,
							);
							return (
								<div
									key={`outcome-right-${outcome.id}`}
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "flex-end",
										gap: 16,
										height: 48,
									}}
								>
									<div
										style={{
											display: "flex",
											width: `${odds <= 1 ? odds + 2 : odds}%`,
											height: 32,
											borderRadius: 9999,
											backgroundColor:
												prediction.resolved && outcome.result
													? "#4cc87d"
													: "#333333",
										}}
									/>
									<p style={{ color: "white", fontSize: 36 }}>{odds}%</p>
								</div>
							);
						})}
				</div>
			</div>

			<div
				style={{
					fontSize: 36,
					display: "flex",
					color: "white",
					fontFamily: "Cabin",
				}}
			>
				nouns.gg/predictions/{prediction.handle}
			</div>
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
