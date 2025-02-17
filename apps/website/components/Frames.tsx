// /** @jsxImportSource frog/jsx */
// import { Button, Frog } from "frog";
// import { handle } from "frog/next";
// import { handle as handle_hono } from "hono/vercel";
// import { devtools } from "frog/dev";
// import { serveStatic } from "frog/serve-static";
// import { getRound } from "@/server/queries/rounds";
// import { roundState } from "@/utils/roundState";
// import { env } from "~/env";
// import { getUserVotesForRound } from "@/server/queries/votes";
// import { getUser } from "@/server/queries/users";

// const app = new Frog({
// 	basePath: "/api/frames",
// 	title: "Nouns Esports",
// 	imageOptions: {
// 		fonts: [
// 			{
// 				name: "Luckiest Guy",
// 				source: "google",
// 			},
// 			{
// 				name: "Bebas Neue",
// 				source: "google",
// 			},
// 			{
// 				name: "Cabin",
// 				weight: 500,
// 				source: "google",
// 			},
// 			{
// 				name: "Cabin",
// 				weight: 600,
// 				source: "google",
// 			},
// 		],
// 	},
// });

// app.frame("/join/:channel", async (c) => {
// 	return c.res({
// 		headers: {
// 			"Cache-Control": "max-age=0",
// 		},
// 		image: <div>Join</div>,
// 		intents: [
// 			<Button.Link href={`${env.NEXT_PUBLIC_DOMAIN}/api/`}>
// 				Get Started
// 			</Button.Link>,
// 		],
// 		title: "Join",
// 	});
// });

// app.frame("/rounds/:id", async (c) => {
// 	const round = await getRound({ id: c.req.param("id") });

// 	if (!round) {
// 		return c.error({ statusCode: 404, message: "Round not found" });
// 	}

// 	const state = roundState({
// 		start: round.start,
// 		votingStart: round.votingStart,
// 		end: round.end,
// 	});

// 	const now = new Date();
// 	const targetDate =
// 		state === "Upcoming"
// 			? new Date(round.start)
// 			: state === "Proposing"
// 				? new Date(round.votingStart)
// 				: new Date(round.end);

// 	const timeDiff = targetDate.getTime() - now.getTime();
// 	const days = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
// 	const hours = Math.max(
// 		0,
// 		Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
// 	);
// 	const minutes = Math.max(
// 		0,
// 		Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
// 	);
// 	const seconds = Math.max(0, Math.floor((timeDiff % (1000 * 60)) / 1000));

// 	const time =
// 		days >= 1
// 			? `${days}d ${hours}h ${minutes}m`
// 			: `${hours}h ${minutes}m ${seconds}s`;

// 	return c.res({
// 		headers: {
// 			"Cache-Control": "max-age=0",
// 		},
// 		image: (
// 			<div
// 				style={{
// 					display: "flex",
// 					flexDirection: "column",
// 					backgroundColor: "#121213",
// 					flex: 1,
// 				}}
// 			>
// 				<img
// 					src={round.image}
// 					style={{
// 						width: "100%",
// 						height: "40%",
// 						objectFit: "cover",
// 						flexShrink: 0,
// 					}}
// 				/>
// 				<div
// 					style={{
// 						display: "flex",
// 						flexDirection: "column",
// 						flex: 1,
// 						padding: 36,
// 					}}
// 				>
// 					<div
// 						style={{
// 							display: "flex",
// 							flexDirection: "column",
// 							gap: 64,
// 							flex: 1,
// 						}}
// 					>
// 						<h1
// 							style={{
// 								fontSize: 72,
// 								fontWeight: 600,
// 								margin: 0,
// 								fontFamily: "Bebas Neue",
// 								color: "white",
// 							}}
// 						>
// 							{round.name}
// 						</h1>
// 						<div style={{ display: "flex", flexDirection: "row", gap: 24 }}>
// 							<p
// 								style={{
// 									fontSize: 36,
// 									margin: 0,
// 									color: "#909497",
// 									weight: 500,
// 									fontFamily: "Cabin",
// 								}}
// 							>
// 								{state === "Upcoming" ? "Round starts" : ""}
// 								{state === "Proposing" ? "Voting starts" : ""}
// 								{state === "Voting" ? "Round ends" : ""}
// 								{state === "Ended" ? "Round ended" : ""}
// 							</p>
// 							<p
// 								style={{
// 									fontSize: 36,
// 									margin: 0,
// 									color: "white",
// 									weight: 500,
// 									fontFamily: "Cabin",
// 								}}
// 							>
// 								{state === "Ended"
// 									? new Intl.DateTimeFormat("en-US", {
// 											year: "numeric",
// 											month: "long",
// 											day: "numeric",
// 										}).format(new Date(round.end))
// 									: time}
// 							</p>
// 						</div>
// 					</div>
// 					<div
// 						style={{
// 							backgroundColor: "#333333",
// 							padding: 16,
// 							paddingRight: 32,
// 							borderRadius: 9999,
// 							display: "flex",
// 							color: "white",
// 							alignItems: "center",
// 							alignSelf: "flex-start",
// 							gap: 24,
// 						}}
// 					>
// 						<img
// 							src={round.community?.image ?? "/logo/logo-square.png"}
// 							style={{ width: 64, height: 64, borderRadius: "100%" }}
// 						/>
// 						<p
// 							style={{
// 								margin: 0,
// 								fontFamily: "Cabin",
// 								fontSize: 36,
// 								fontWeight: 500,
// 								whiteSpace: "nowrap",
// 							}}
// 						>
// 							{round.community?.name ?? "Nouns Esports"}
// 						</p>
// 					</div>
// 				</div>
// 			</div>
// 		),
// 		imageAspectRatio: "1:1",
// 		imageOptions: {
// 			width: 1200,
// 			height: 1200,
// 		},
// 		intents: [
// 			<Button.Link href={`${env.NEXT_PUBLIC_DOMAIN}/rounds/${round.id}`}>
// 				View
// 			</Button.Link>,
// 			<Button.Link href={`${env.NEXT_PUBLIC_DOMAIN}/rounds`}>
// 				All Rounds
// 			</Button.Link>,
// 		],
// 		title: round.name,
// 		ogImage: round.image,
// 	});
// });

// app.frame("/rounds/:round/votes/:user", async (c) => {
// 	return c.res({
// 		image: `${env.NEXT_PUBLIC_DOMAIN}/api/frames/rounds/${c.req.param("round")}/votes/${c.req.param("user")}/img`,
// 		intents: [
// 			<Button.Link
// 				href={`${env.NEXT_PUBLIC_DOMAIN}/rounds/${c.req.param("round")}`}
// 			>
// 				View Round
// 			</Button.Link>,
// 		],
// 		imageAspectRatio: "1:1",
// 		browserLocation: `/rounds/${c.req.param("round")}`,
// 	});
// });

// app.image("/rounds/:round/votes/:user/img", async (c) => {
// 	const user = await getUser({ user: c.req.param("user") });

// 	if (!user) {
// 		return c.res({
// 			image: <div style={{ display: "flex", color: "red" }}>No user found</div>,
// 		});
// 	}

// 	const round = await getUserVotesForRound({
// 		round: c.req.param("round"),
// 		user: c.req.param("user"),
// 		wallet: user.wallet ?? undefined,
// 	});

// 	if (!round) {
// 		return c.res({
// 			image: (
// 				<div style={{ display: "flex", color: "red" }}>
// 					User did not vote in the round or it doesnt exist
// 				</div>
// 			),
// 		});
// 	}

// 	if (round.votes.length < 1) {
// 		return c.res({
// 			image: (
// 				<div style={{ display: "flex", color: "red" }}>User has no votes</div>
// 			),
// 		});
// 	}

// 	return c.res({
// 		headers: {
// 			"Cache-Control": "max-age=0",
// 		},
// 		image: (
// 			<div
// 				style={{
// 					color: "white",
// 					backgroundColor: "#121213",
// 					display: "flex",
// 					flexDirection: "column",
// 					justifyContent: "space-between",
// 					height: "100%",
// 					width: "100%",
// 				}}
// 			>
// 				<img
// 					src={round.image}
// 					style={{
// 						width: "100%",
// 						height: "40%",
// 						objectFit: "cover",
// 						flexShrink: 0,
// 					}}
// 				/>
// 				<div
// 					style={{
// 						display: "flex",
// 						flexDirection: "column",
// 						justifyContent: "space-between",
// 						padding: 48,
// 						flex: 1,
// 					}}
// 				>
// 					<div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
// 						<div
// 							style={{
// 								display: "flex",
// 								flexDirection: "row",
// 								gap: 32,
// 								alignItems: "center",
// 							}}
// 						>
// 							<img
// 								src={user.image}
// 								style={{ width: 90, height: 90, borderRadius: "100%" }}
// 							/>
// 							<div
// 								style={{
// 									display: "flex",
// 									fontSize: 64,
// 									fontWeight: 600,
// 									fontFamily: "Bebas Neue",
// 								}}
// 							>
// 								{user.name}'s Votes
// 							</div>
// 						</div>
// 						<div
// 							style={{
// 								display: "flex",
// 								flexDirection: "column",
// 								gap: 32,
// 							}}
// 						>
// 							{round.votes.slice(0, 4).map((vote) => (
// 								<div
// 									style={{
// 										display: "flex",
// 										justifyContent: "space-between",
// 										gap: 64,
// 										width: "100%",
// 										backgroundColor: "#1A1A1A",
// 										paddingLeft: 32,
// 										paddingRight: 32,
// 										paddingTop: 20,
// 										paddingBottom: 20,
// 										borderRadius: 16,
// 									}}
// 								>
// 									<div
// 										style={{
// 											display: "block",
// 											lineClamp: 1,
// 											fontSize: 36,
// 											fontFamily: "Cabin",
// 										}}
// 									>
// 										{vote.proposal.title.replace(
// 											/[^a-zA-Z0-9 \-_\!\@\#\$\%\^\&\*\(\)\+\=\"\'\?\/\>\<,\.\{\}\[\]\|\\\~\`\;\:\n\r\t]/g,
// 											"",
// 										)}
// 									</div>
// 									<div
// 										style={{
// 											display: "flex",
// 											gap: 16,
// 											alignItems: "center",
// 										}}
// 									>
// 										<div
// 											style={{
// 												display: "flex",
// 												fontSize: 36,
// 												fontFamily: "Cabin",
// 											}}
// 										>
// 											{vote.count.toString()}
// 										</div>
// 									</div>
// 								</div>
// 							))}
// 							{round.votes.length > 4 ? (
// 								<div
// 									style={{
// 										display: "flex",
// 										fontSize: 36,
// 										fontFamily: "Cabin",
// 									}}
// 								>
// 									+{(round.votes.length - 4).toString()} more
// 								</div>
// 							) : (
// 								""
// 							)}
// 						</div>
// 					</div>
// 					{round.votes.length < 4 ? (
// 						<div
// 							style={{
// 								fontSize: 36,
// 								display: "flex",
// 								color: "#909497",
// 								fontFamily: "Cabin",
// 							}}
// 						>
// 							nouns.gg/rounds/{round.id}
// 						</div>
// 					) : (
// 						""
// 					)}
// 				</div>
// 			</div>
// 		),
// 		imageOptions: {
// 			width: 1200,
// 			height: 1200,
// 		},
// 	});
// });

// devtools(app, { serveStatic });

// // export const GET = handle(app);
// // export const POST = handle(app);
// export const GET = handle_hono(app.hono).bind(app.hono);
// export const POST = handle_hono(app.hono).bind(app.hono);
