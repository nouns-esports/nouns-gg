import { db } from "..";
import {
	casts,
	follows,
	profiles,
	reactions as reactionsTable,
} from "../schema/farcaster";
import {
	nouns,
	nounsTraits,
	nounsAuctions,
	nounsVotes,
	nounsProposals,
	nounDelegates,
	lilnounDelegates,
	nounsBids,
	nounsClients,
} from "../schema/indexer";
import fs from "fs";

const data = JSON.parse(
	fs.readFileSync("./seed.json", "utf8"),
	(key, value) => {
		// Handle BigInt deserialization
		if (typeof value === "string" && value.startsWith("bigint::")) {
			return BigInt(value.substring(8));
		}
		// Handle Date deserialization
		if (
			typeof value === "string" &&
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)
		) {
			return new Date(value);
		}
		return value;
	},
);

await db.pgpool.transaction(async (tx) => {
	let castCount = 0;
	for (const cast of data.farcaster) {
		castCount++;
		console.log(`Processing cast ${castCount} of ${data.farcaster.length}`);
		const { reactions, creator, ...castData } = cast;
		await tx
			.insert(casts)
			.values(
				// @ts-ignore
				castData,
			)
			.onConflictDoNothing();

		const { followers, following, ...creatorData } = creator;

		await tx
			.insert(profiles)
			.values(
				// @ts-ignore
				creatorData,
			)
			.onConflictDoNothing();

		for (const follower of cast.creator.followers) {
			await tx
				.insert(follows)
				.values(
					// @ts-ignore
					follower,
				)
				.onConflictDoNothing();
		}

		for (const following of cast.creator.following) {
			await tx
				.insert(follows)
				.values(
					// @ts-ignore
					following,
				)
				.onConflictDoNothing();
		}

		for (const reaction of cast.reactions) {
			await tx
				.insert(reactionsTable)
				.values(
					// @ts-ignore
					reaction,
				)
				.onConflictDoNothing();
		}
	}

	let nounCount = 0;
	for (const noun of data.indexer.nouns) {
		nounCount++;
		console.log(`Processing noun ${nounCount} of ${data.indexer.nouns.length}`);
		await tx
			.insert(nouns)
			.values(
				// @ts-ignore
				noun,
			)
			.onConflictDoNothing();
	}

	let nounTraitCount = 0;
	for (const nounTrait of data.indexer.nounsTraits) {
		nounTraitCount++;
		console.log(
			`Processing noun trait ${nounTraitCount} of ${data.indexer.nounsTraits.length}`,
		);
		await tx
			.insert(nounsTraits)
			.values(
				// @ts-ignore
				nounTrait,
			)
			.onConflictDoNothing();
	}

	let nounAuctionCount = 0;
	for (const nounAuction of data.indexer.nounsAuctions) {
		nounAuctionCount++;
		console.log(
			`Processing noun auction ${nounAuctionCount} of ${data.indexer.nounsAuctions.length}`,
		);
		await tx
			.insert(nounsAuctions)
			.values(
				// @ts-ignore
				nounAuction,
			)
			.onConflictDoNothing();
	}

	let nounVoteCount = 0;
	for (const nounVote of data.indexer.nounsVotes) {
		nounVoteCount++;
		console.log(
			`Processing noun vote ${nounVoteCount} of ${data.indexer.nounsVotes.length}`,
		);
		await tx
			.insert(nounsVotes)
			.values(
				// @ts-ignore
				nounVote,
			)
			.onConflictDoNothing();
	}

	let nounProposalCount = 0;
	for (const nounProposal of data.indexer.nounsProposals) {
		nounProposalCount++;
		console.log(
			`Processing noun proposal ${nounProposalCount} of ${data.indexer.nounsProposals.length}`,
		);
		await tx
			.insert(nounsProposals)
			.values(
				// @ts-ignore
				nounProposal,
			)
			.onConflictDoNothing();
	}

	let nounDelegateCount = 0;
	for (const nounDelegate of data.indexer.nounDelegates) {
		nounDelegateCount++;
		console.log(
			`Processing noun delegate ${nounDelegateCount} of ${data.indexer.nounDelegates.length}`,
		);
		await tx
			.insert(nounDelegates)
			.values(
				// @ts-ignore
				nounDelegate,
			)
			.onConflictDoNothing();
	}

	let lilnounDelegateCount = 0;
	for (const lilnounDelegate of data.indexer.lilnounDelegates) {
		lilnounDelegateCount++;
		console.log(
			`Processing lilnoun delegate ${lilnounDelegateCount} of ${data.indexer.lilnounDelegates.length}`,
		);
		await tx
			.insert(lilnounDelegates)
			.values(
				// @ts-ignore
				lilnounDelegate,
			)
			.onConflictDoNothing();
	}

	let nounBidCount = 0;
	for (const nounBid of data.indexer.nounsBids) {
		nounBidCount++;
		console.log(
			`Processing noun bid ${nounBidCount} of ${data.indexer.nounsBids.length}`,
		);
		await tx
			.insert(nounsBids)
			// @ts-ignore
			.values({
				...nounBid,
			})
			.onConflictDoNothing();
	}

	let nounClientCount = 0;
	for (const nounClient of data.indexer.nounsClients) {
		nounClientCount++;
		console.log(
			`Processing noun client ${nounClientCount} of ${data.indexer.nounsClients.length}`,
		);
		await tx
			.insert(nounsClients)
			.values(
				// @ts-ignore
				nounClient,
			)
			.onConflictDoNothing();
	}
});
