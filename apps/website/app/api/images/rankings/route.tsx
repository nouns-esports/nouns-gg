import satori from "satori";
import { join } from "path";
import fs from "fs";
import { getLeaderboardPosition } from "@/server/queries/rankings";
import { CaretDown } from "phosphor-react-sc";
import { CaretUp } from "phosphor-react-sc";
import { Resvg } from "@resvg/resvg-wasm";
import { isInitialized, init } from "../wasm";

export const dynamic = "force-static";
export const revalidate = 600;

export async function GET(request: Request) {
	if (!isInitialized) {
		await init();
	}

	const Cabin = fs.readFileSync(
		join(process.cwd(), "./public/fonts/Cabin-SemiBold.ttf"),
	);

	const LuckiestGuy = fs.readFileSync(
		join(process.cwd(), "./public/fonts/LuckiestGuy-Regular.ttf"),
	);
	const BebasNeue = fs.readFileSync(
		join(process.cwd(), "./public/fonts/BebasNeue-Regular.ttf"),
	);
	const LondrinaSolid = fs.readFileSync(
		join(process.cwd(), "./public/fonts/LondrinaSolid-Regular.ttf"),
	);

	const url = new URL(request.url);

	const params = {
		user: url.searchParams.get("user"),
	};

	if (!params.user) {
		throw new Error("User is required");
	}

	const ranking = await getLeaderboardPosition({ user: params.user });

	if (!ranking) {
		throw new Error("User not found");
	}

	const diff = ranking.position - ranking.previousPosition;

	return new Response(
		new Resvg(
			await satori(
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
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<div
							style={{
								display: "flex",
								gap: 40,
								alignItems: "center",
							}}
						>
							<img
								src={ranking.user.image}
								style={{
									width: 150,
									height: 150,
									borderRadius: "100%",
								}}
							/>
							<p
								style={{
									color: "white",
									fontSize: 80,
									fontWeight: 600,
									fontFamily: "Cabin",
								}}
							>
								{ranking.user.name}
							</p>
						</div>
						<div
							style={{
								display: "flex",
								gap: 40,
								alignItems: "center",
							}}
						>
							{diff !== 0 ? (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: 4,
										color: diff > 0 ? "#10B981" : "#EF4444",
									}}
								>
									{diff > 0 ? (
										<CaretUp style={{ width: 16, height: 16 }} weight="fill" />
									) : (
										<CaretDown
											style={{ width: 16, height: 16 }}
											weight="fill"
										/>
									)}
									{Math.abs(diff)}
								</div>
							) : null}
							<p
								style={{
									color: "white",
									fontSize: 80,
									fontWeight: 600,
									fontFamily: "Cabin",
								}}
							>
								#{ranking.position}
							</p>
						</div>
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						{ranking.rank ? (
							<div
								style={{
									display: "flex",
									gap: 24,
									alignItems: "center",
								}}
							>
								<img
									src={ranking.rank.image}
									style={{
										width: 180,
										height: 180,
										objectFit: "contain",
									}}
								/>
								<p
									style={{
										color: ranking.rank.color,
										fontSize: 100,
										fontFamily: "Bebas Neue",
										lineHeight: 1,
									}}
								>
									{ranking.rank.name}
								</p>
							</div>
						) : null}
					</div>
				</div>,
				{
					width: 1200,
					height: 800,

					fonts: [
						{
							name: "Cabin",
							data: Cabin,
							weight: 400,
							style: "normal",
						},
						{
							name: "Luckiest Guy",
							data: LuckiestGuy,
							weight: 400,
							style: "normal",
						},
						{
							name: "Bebas Neue",
							data: BebasNeue,
							weight: 400,
							style: "normal",
						},
						{
							name: "Londrina Solid",
							data: LondrinaSolid,
							weight: 400,
							style: "normal",
						},
					],
				},
			),
		)
			.render()
			.asPng(),
		{
			headers: {
				"Content-Type": "image/png",
			},
		},
	);
}
