import { getLeaderboardPosition } from "@/server/queries/rankings";
import { CaretDown } from "phosphor-react-sc";
import { CaretUp } from "phosphor-react-sc";
import { generateImage } from "../generateImage";

export async function GET(request: Request) {
	const url = new URL(request.url);

	const params = {
		user: url.searchParams.get("user"),
	};

	if (!params.user) {
		return Response.json({ error: "User is required" }, { status: 400 });
	}

	const ranking = await getLeaderboardPosition({ user: params.user });

	if (!ranking) {
		return Response.json({ error: "User not found" }, { status: 404 });
	}

	const diff = ranking.position - ranking.previousPosition;

	return new Response(
		await generateImage({
			size: {
				width: 1200,
				height: 800,
			},
			image: (
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
				</div>
			),
		}),
		{
			headers: {
				"Content-Type": "image/svg",
			},
		},
	);
}
