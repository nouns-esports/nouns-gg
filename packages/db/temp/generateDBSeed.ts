import { db } from "../";
import { eq } from "drizzle-orm";
import { casts } from "../schema/farcaster";
import fs from "fs";

const farcasterData = await db.pgpool.query.casts.findMany({
	where: eq(casts.parentUrl, "https://warpcast.com/~/channel/noundry"),
	limit: 10,
	with: {
		reactions: {
			limit: 10,
		},
		creator: {
			with: {
				followers: {
					limit: 10,
				},
				following: {
					limit: 10,
				},
			},
		},
	},
});

const indexerData = {
	nounsProposals: await db.pgpool.query.nounsProposals.findMany({
		limit: 10,
	}),
	nounsVotes: await db.pgpool.query.nounsVotes.findMany({
		limit: 10,
	}),
	voteReposts: await db.pgpool.query.voteReposts.findMany({
		limit: 10,
	}),
	nounsClients: await db.pgpool.query.nounsClients.findMany({
		limit: 10,
	}),
	nouns: await db.pgpool.query.nouns.findMany({
		limit: 10,
	}),
	nounsTraits: await db.pgpool.query.nounsTraits.findMany({
		limit: 10,
	}),
	nounsAuctions: await db.pgpool.query.nounsAuctions.findMany({
		limit: 10,
	}),
	erc721Balances: await db.pgpool.query.erc721Balances.findMany({
		limit: 10,
	}),
	nounDelegates: await db.pgpool.query.nounDelegates.findMany({
		limit: 10,
	}),
	lilnounDelegates: await db.pgpool.query.lilnounDelegates.findMany({
		limit: 10,
	}),
	nounsBids: await db.pgpool.query.nounsBids.findMany({
		limit: 10,
	}),
};

fs.writeFileSync(
	"seed.json",
	JSON.stringify(
		{
			farcaster: farcasterData,
			indexer: indexerData,
		},
		(key, value) => {
			// Handle BigInt serialization
			if (typeof value === "bigint") {
				return `bigint::${value.toString()}`;
			}
			return value;
		},
		2,
	),
);
