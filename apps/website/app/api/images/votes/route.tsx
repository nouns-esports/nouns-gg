import { getUser } from "@/server/queries/users";
import { getVotes } from "@/server/queries/votes";
import { ImageResponse } from "next/og";
import fs from "fs";
import path, { join } from "path";
import { getRound } from "@/server/queries/rounds";

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

	const round = await getRound({ handle: params.round });

	if (!round) {
		return Response.json({ error: "Round not found" }, { status: 404 });
	}

	const votes = await getVotes({ round: round.id, user: user.id });

	if (votes.length < 1) {
		return Response.json(
			{ error: "User did not vote in the round" },
			{ status: 404 },
		);
	}

	const condensedVotes = Object.values(
		votes.reduce((acc: Record<string, typeof vote>, vote) => {
			if (!acc[vote.proposal.title]) {
				acc[vote.proposal.title] = { ...vote };
			} else acc[vote.proposal.title].count += vote.count;

			return acc;
		}, {}),
	);

	return new ImageResponse(
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
						{votes.slice(0, condensedVotes.length > 4 ? 3 : 4).map((vote) => (
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
						{condensedVotes.length > 4 ? (
							<div
								style={{
									display: "flex",
									fontSize: 36,
									fontFamily: "Cabin",
								}}
							>
								+{(condensedVotes.length - 4).toString()} more
							</div>
						) : (
							""
						)}
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
					nouns.gg/rounds/{round.handle}
				</div>
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
