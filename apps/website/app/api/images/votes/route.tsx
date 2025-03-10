import { getUser } from "@/server/queries/users";
import { getUserVotesForRound } from "@/server/queries/votes";
import { generateImage } from "../generateImage";

export async function GET(request: Request) {
	const url = new URL(request.url);

	const params = {
		user: url.searchParams.get("user"),
		round: url.searchParams.get("round"),
	};

	if (!params.user || !params.round) {
		return Response.json(
			{ error: "User and round are required" },
			{ status: 400 },
		);
	}

	const user = await getUser({ user: params.user });

	if (!user) {
		return Response.json({ error: "User not found" }, { status: 404 });
	}

	const round = await getUserVotesForRound({
		round: params.round,
		user: params.user,
	});

	if (!round) {
		return Response.json(
			{ error: "User did not vote in the round or it doesnt exist" },
			{ status: 404 },
		);
	}

	if (round.votes.length < 1) {
		return Response.json({ error: "User has no votes" }, { status: 404 });
	}

	return new Response(
		await generateImage({
			size: {
				width: 1200,
				height: 800,
			},
			image: (
				<div
					style={{
						color: "white",
						backgroundColor: "#121213",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						height: "100%",
						width: "100%",
						position: "relative",
						overflow: "hidden",
					}}
				>
					{/* Background image with blur */}
					<img
						src={round.image}
						style={{
							position: "absolute",
							width: "100%",
							height: "100%",
							objectFit: "cover",
							filter: "blur(100px)",
							opacity: 0.5,
							transform: "scale(1.1)", // Prevents blur edges from showing
						}}
					/>

					{/* Content on top with transparent background */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							padding: 48,
							flex: 1,
							position: "relative", // Position on top of the background
							backgroundColor: "transparent", // Semi-transparent dark background
							zIndex: 1,
							height: "100%",
						}}
					>
						<div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									gap: 32,
									alignItems: "center",
								}}
							>
								<img
									src={user.image}
									style={{ width: 90, height: 90, borderRadius: "100%" }}
								/>
								<div
									style={{
										display: "flex",
										fontSize: 64,
										fontWeight: 600,
										fontFamily: "Bebas Neue",
									}}
								>
									{user.name}'s Votes
								</div>
							</div>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 32,
								}}
							>
								{round.votes
									.slice(0, round.votes.length > 4 ? 3 : 4)
									.map((vote) => (
										<div
											key={vote.proposal.title}
											style={{
												display: "flex",
												justifyContent: "space-between",
												gap: 64,
												width: "100%",
												backgroundColor: "rgba(255, 255, 255, 0.15)", // More transparent
												paddingLeft: 32,
												paddingRight: 32,
												paddingTop: 20,
												paddingBottom: 20,
												borderRadius: 16,
											}}
										>
											<div
												style={{
													display: "block",
													lineClamp: 1,
													fontSize: 36,
													fontFamily: "Cabin",
												}}
											>
												{vote.proposal.title.replace(
													/[^a-zA-Z0-9 \-_\!\@\#\$\%\^\&\*\(\)\+\=\"\'\?\/\>\<,\.\{\}\[\]\|\\\~\`\;\:\n\r\t]/g,
													"",
												)}
											</div>
											<div
												style={{
													display: "flex",
													gap: 16,
													alignItems: "center",
												}}
											>
												<div
													style={{
														display: "flex",
														fontSize: 36,
														fontFamily: "Cabin",
													}}
												>
													{vote.count.toString()}
												</div>
											</div>
										</div>
									))}
								{round.votes.length > 4 ? (
									<div
										style={{
											display: "flex",
											fontSize: 36,
											fontFamily: "Cabin",
										}}
									>
										+{(round.votes.length - 4).toString()} more
									</div>
								) : (
									""
								)}
							</div>
						</div>
						{round.votes.length < 5 ? (
							<div
								style={{
									fontSize: 36,
									display: "flex",
									color: "white",
									fontFamily: "Cabin",
								}}
							>
								nouns.gg/rounds/{round.id}
							</div>
						) : (
							""
						)}
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
