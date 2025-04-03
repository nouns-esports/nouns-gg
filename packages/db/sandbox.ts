import { eq } from "drizzle-orm";
import { db } from ".";
import { outcomes, predictions } from "./schema/public";

const eventPredictions = await db.primary.query.predictions.findMany({
	where: eq(predictions.event, 7),
	with: {
		event: true,
	}
})

for (const prediction of eventPredictions) {
	await db.primary.update(predictions).set({
		handle: `${prediction.event?.handle}-${prediction.handle}`,
		rules: {}
	}).where(eq(predictions.id, prediction.id))
}

// const image = "https://ipfs.nouns.gg/ipfs/bafybeigagt5pr5m5cqxdzyt6r6bluvngncfzs2jjixteszcepsy5mshrja";

// const generatedData: Array<{
// 	handle: string; // unique short handle (for url)
// 	name: string; // name of the prediction
// 	xp: 100 | 150 | 250 // easy, medium, hard (ignore xp numbers on my prompt and use these instead)
// 	outcomes: Array<{
// 		name: string; // name of the outcome
// 	}>
// }> = [
// 	{
// 		handle: "team-a-vs-team-d-winner",
// 		name: "Team A vs Team D Winner",
// 		xp: 100,
// 		outcomes: [
// 			{ name: "Team A" },
// 			{ name: "Team D" },
// 			{ name: "Draw" }
// 		]
// 	},
// 	{
// 		handle: "team-b-vs-team-c-winner",
// 		name: "Team B vs Team C Winner", 
// 		xp: 100,
// 		outcomes: [
// 			{ name: "Team B" },
// 			{ name: "Team C" },
// 			{ name: "Draw" }
// 		]
// 	},
// 	{
// 		handle: "total-goals-team-a-vs-team-d",
// 		name: "Total Goals in Team A vs Team D",
// 		xp: 150,
// 		outcomes: [
// 			{ name: "Over 2.5 Goals" },
// 			{ name: "Under 2.5 Goals" }
// 		]
// 	},
// 	{
// 		handle: "total-goals-team-b-vs-team-c",
// 		name: "Total Goals in Team B vs Team C",
// 		xp: 150,
// 		outcomes: [
// 			{ name: "Over 2.5 Goals" },
// 			{ name: "Under 2.5 Goals" }
// 		]
// 	},
// 	{
// 		handle: "first-scorer-semifinal-1",
// 		name: "First Team to Score in Semifinals (Match 1)",
// 		xp: 150,
// 		outcomes: [
// 			{ name: "Winner of Team A vs Team D" },
// 			{ name: "Winner of Team B vs Team C" }
// 		]
// 	},
// 	{
// 		handle: "first-scorer-semifinal-2", 
// 		name: "First Team to Score in Semifinals (Match 2)",
// 		xp: 150,
// 		outcomes: [
// 			{ name: "Winner of Team A vs Team D" },
// 			{ name: "Winner of Team B vs Team C" }
// 		]
// 	},
// 	{
// 		handle: "final-match-winner",
// 		name: "Final Match Winner",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Team A" },
// 			{ name: "Team B" },
// 			{ name: "Team C" },
// 			{ name: "Team D" }
// 		]
// 	},
// 	{
// 		handle: "total-goals-final",
// 		name: "Total Goals in the Final",
// 		xp: 150,
// 		outcomes: [
// 			{ name: "Over 3.5 Goals" },
// 			{ name: "Under 3.5 Goals" }
// 		]
// 	},
// 	{
// 		handle: "zingaraez-goal",
// 		name: "Will Zingaraez Score a Goal?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "shaari-goal",
// 		name: "Will Shaari Score a Goal?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "jezzone-goal",
// 		name: "Will Jezzone Score a Goal?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "kimicat-goal",
// 		name: "Will Kimicat Score a Goal?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "liagenso-goal",
// 		name: "Will Liagenso Score a Goal?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "rosseegaming-goal",
// 		name: "Will Rosseegaming Score a Goal?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "nicole-berenice-goal",
// 		name: "Will NicoleBerenice Score a Goal?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "april-goal",
// 		name: "Will April Score a Goal?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "alejus-goal",
// 		name: "Will Alejus Score a Goal?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "jessiboo-goal",
// 		name: "Will Jessiboo Score a Goal?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "ratadri-goal",
// 		name: "Will RatAdri Score a Goal?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "yasminxiomarap-goal",
// 		name: "Will Yasminxiomarap Score a Goal?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "clean-sheet-team-a-vs-team-d",
// 		name: "Clean Sheet in Team A vs Team D",
// 		xp: 150,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "clean-sheet-team-b-vs-team-c",
// 		name: "Clean Sheet in Team B vs Team C",
// 		xp: 150,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "btts-semifinal-1",
// 		name: "Both Teams to Score in Semifinals (Match 1)",
// 		xp: 150,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "btts-semifinal-2",
// 		name: "Both Teams to Score in Semifinals (Match 2)",
// 		xp: 150,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "total-corners-final",
// 		name: "Total Corners in the Final",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Over 8 Corners" },
// 			{ name: "Under 8 Corners" }
// 		]
// 	},
// 	{
// 		handle: "first-half-goals-final",
// 		name: "First Half Goals in the Final",
// 		xp: 150,
// 		outcomes: [
// 			{ name: "Over 1.5 Goals" },
// 			{ name: "Under 1.5 Goals" }
// 		]
// 	},
// 	{
// 		handle: "red-card-tournament",
// 		name: "Will There Be a Red Card in the Tournament?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "top-scorer-team",
// 		name: "Top Goal Scorer's Team",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Team A" },
// 			{ name: "Team B" },
// 			{ name: "Team C" },
// 			{ name: "Team D" }
// 		]
// 	},
// 	{
// 		handle: "final-penalties",
// 		name: "Will the Final Go to Penalties?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Yes" },
// 			{ name: "No" }
// 		]
// 	},
// 	{
// 		handle: "total-yellow-cards",
// 		name: "Total Yellow Cards in the Tournament",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "Over 10 Yellow Cards" },
// 			{ name: "Under 10 Yellow Cards" }
// 		]
// 	},
// 	{
// 		handle: "prediction-participants",
// 		name: "How Many Users Will Participate in the Predictions?",
// 		xp: 250,
// 		outcomes: [
// 			{ name: "0-250" },
// 			{ name: "251-500" },
// 			{ name: "501-750" },
// 			{ name: "751-1000" },
// 			{ name: "Over 1000" }
// 		]
// 	}
// ]

// await db.primary.transaction(async (tx) => {
// 	for (const data of generatedData) {
// 		const [prediction] = await tx.insert(predictions).values({
// 			handle: data.handle,
// 			name: data.name,
// 			xp: data.xp,
// 			image,		
// 			rules: {
// 				"type": "doc",
// 				"content": []
// 			},	
// 			event: 7,
// 			community: 1,
// 		}).returning({ id: predictions.id })

// 		for (const outcome of data.outcomes) {
// 			await tx.insert(outcomes).values({
// 				prediction: prediction.id,
// 				name: outcome.name,
// 				outcome: false,
// 			})
// 		}
// 	}
// })