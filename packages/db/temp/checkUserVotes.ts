// const user = await db.primary.query.nexus.findFirst({
// 	where: eq(nexus.id, "ff441565-2b8e-40f7-974a-732d9dc265f8"),
// 	with: {
// 		purchasedVotes: true,
// 		accounts: true,
// 		leaderboards: {
// 			with: {
// 				community: true,
// 			},
// 			extras: {
// 				percentile: sql<number>`
// 					(
// 						(
// 							SELECT 1 + COUNT(*)
// 							FROM ${leaderboards} AS l2
// 							WHERE l2.community = ${leaderboards.community}
// 							AND l2.xp > ${leaderboards.xp}
// 							AND l2.xp > 0
// 						)::float
// 						/
// 						(
// 							SELECT COUNT(*)
// 							FROM ${leaderboards} AS l3
// 							WHERE l3.community = ${leaderboards.community}
// 							AND l3.xp > 0
// 						)
// 					)
// 				`.as("percentile"),
// 			},
// 		},
// 	},
// });

// if (!user) {
// 	throw new Error("User not found");
// }

// const round = await db.primary.query.rounds.findFirst({
// 	where: eq(rounds.id, "efaecac8-883f-4a57-91c4-4ca47d917895"),
// 	with: {
// 		actions: true,
// 		community: {
// 			with: {
// 				admins: true,
// 				plugins: true,
// 			},
// 		},
// 	},
// });

// if (!round) {
// 	throw new Error("Round not found");
// }

// let allocatedVotes = 0;

// const actions = round.actions.filter((action) => action.type === "voting");

// for (const actionState of actions) {
// 	const action = getAction({
// 		action: actionState.action,
// 		plugin: actionState.plugin ?? "dash",
// 	});

// 	if (!action) {
// 		throw new Error("Action not found");
// 	}

// 	const completed = await action.check({
// 		user: user,
// 		input: actionState.input,
// 		community: round.community,
// 	});

// 	if (actionState.required && !completed) {
// 		throw new Error("Voting prerequisites not met");
// 	}

// 	if (actionState.votes > 0) {
// 		console.log("Action", actionState.action, actionState.votes);
// 	}

// 	if (completed) {
// 		allocatedVotes += actionState.votes;
// 	}
// }

// if (round.votingConfig?.mode === "leaderboard") {
// 	const percentile =
// 		user.leaderboards.find(
// 			(leaderboard) => leaderboard.community.id === round.community.id,
// 		)?.percentile ?? 1;

// 	if (percentile <= 0.02) {
// 		console.log("Leaderboard: 10");
// 		allocatedVotes += 10;
// 	} else if (percentile <= 0.05) {
// 		console.log("Leaderboard: 5");
// 		allocatedVotes += 5;
// 	} else if (percentile <= 0.15) {
// 		console.log("Leaderboard: 3");
// 		allocatedVotes += 3;
// 	} else {
// 		console.log("Leaderboard: 1");
// 		allocatedVotes += 1;
// 	}
// }

// const pass = user.leaderboards.find(
// 	(leaderboard) => leaderboard.community.id === round.community.id,
// );

// console.log("User", user.name);
// console.log("Allocated votes", allocatedVotes);
// console.log("XP", pass?.xp);
// console.log("Rank", pass?.percentile);
// console.log(
// 	"Purchased votes",
// 	user.purchasedVotes.reduce((acc, vote) => acc + vote.used, 0),
// 	"/",
// 	user.purchasedVotes.reduce((acc, vote) => acc + vote.count, 0),
// );
