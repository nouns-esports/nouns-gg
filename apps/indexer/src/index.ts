import { ponder } from "ponder:registry";
import {
	lilnounDelegates,
	lilnouners,
	nounDelegates,
	nouners,
	// nounsProposals,
} from "../ponder.schema";

ponder.on("NounsToken:Transfer", async ({ event, context }) => {
	await context.db
		.insert(nouners)
		.values({
			id: event.args.tokenId,
			owner: event.args.to,
		})
		.onConflictDoUpdate({
			owner: event.args.to,
		});
});

ponder.on("LilNounsToken:Transfer", async ({ event, context }) => {
	await context.db
		.insert(lilnouners)
		.values({
			id: event.args.tokenId,
			owner: event.args.to,
		})
		.onConflictDoUpdate({
			owner: event.args.to,
		});
});

ponder.on("NounsToken:DelegateChanged", async ({ event, context }) => {
	await context.db
		.insert(nounDelegates)
		.values({
			from: event.args.fromDelegate,
			to: event.args.toDelegate,
		})
		.onConflictDoUpdate({
			to: event.args.toDelegate,
		});
});

ponder.on("LilNounsToken:DelegateChanged", async ({ event, context }) => {
	await context.db
		.insert(lilnounDelegates)
		.values({
			from: event.args.fromDelegate,
			to: event.args.toDelegate,
		})
		.onConflictDoUpdate({
			to: event.args.toDelegate,
		});
});

// ponder.on("NounsDAOGovernor:ProposalCreated", async ({ event, context }) => {
// 	const startTime = await context.client.getBlock({
// 		blockNumber: event.args.startBlock,
// 	});
// 	const endTime = await context.client.getBlock({
// 		blockNumber: event.args.endBlock,
// 	});

// 	await context.db.insert(nounsProposals).values({
// 		id: event.args.id,
// 		proposer: event.args.proposer,
// 		targets: [...event.args.targets],
// 		values: [...event.args.values],
// 		signatures: [...event.args.signatures],
// 		calldatas: [...event.args.calldatas],
// 		description: event.args.description,
// 		startTime: new Date(Number(startTime.timestamp) * 1000),
// 		endTime: new Date(Number(endTime.timestamp) * 1000),
// 		createdAt: new Date(Number(event.block.timestamp) * 1000),
// 	});
// });
