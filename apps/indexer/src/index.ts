import { ponder } from "ponder:registry";
import {
	lilnounDelegates,
	lilnouners,
	nounDelegates,
	nouners,
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
