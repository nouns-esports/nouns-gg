import { relations } from "drizzle-orm";
import {
	snapshots,
	nexus,
	notifications,
	communities,
	rounds,
	creations,
	events,
	quests,
	attendees,
	predictions,
	products,
	checkpoints,
	checkins,
	outcomes,
	bets,
	xp,
	awards,
	proposals,
	votes,
	ranks,
	assets,
	rankings,
	carts,
	gold,
	collections,
	raffles,
	raffleEntries,
	communityAdmins,
} from "./schema/public";
import {
	erc721Balances,
	nounDelegates,
	lilnounDelegates,
	nounsProposals,
	nounsVotes,
	nounsTraits,
	nouns,
} from "./schema/indexer";

export const snapshotsRelations = relations(snapshots, ({ one }) => ({
	user: one(nexus, {
		fields: [snapshots.user],
		references: [nexus.id],
	}),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(nexus, {
		fields: [notifications.user],
		references: [nexus.id],
	}),
}));

export const communityRelations = relations(communities, ({ one, many }) => ({
	rounds: many(rounds),
	creations: many(creations),
	events: many(events),
	quests: many(quests),
	admins: many(communityAdmins),
	predictions: many(predictions),
}));

export const communityAdminsRelations = relations(
	communityAdmins,
	({ one }) => ({
		community: one(communities, {
			fields: [communityAdmins.community],
			references: [communities.id],
		}),
		user: one(nexus, {
			fields: [communityAdmins.user],
			references: [nexus.id],
		}),
	}),
);

export const eventsRelations = relations(events, ({ one, many }) => ({
	community: one(communities, {
		fields: [events.community],
		references: [communities.id],
	}),
	quests: many(quests),
	rounds: many(rounds),
	attendees: many(attendees),
	predictions: many(predictions),
	products: many(products),
	checkpoints: many(checkpoints),
	raffles: many(raffles),
	creator: one(nexus, {
		fields: [events.creator],
		references: [nexus.id],
	}),
}));

export const checkpointsRelations = relations(checkpoints, ({ one, many }) => ({
	event: one(events, {
		fields: [checkpoints.event],
		references: [events.id],
	}),
	checkins: many(checkins),
}));

export const predictionsRelations = relations(predictions, ({ one, many }) => ({
	event: one(events, {
		fields: [predictions.event],
		references: [events.id],
	}),
	outcomes: many(outcomes),
	bets: many(bets),
	creator: one(nexus, {
		fields: [predictions.creator],
		references: [nexus.id],
	}),
	earnedXP: many(xp),
	gold: many(gold),
}));

export const outcomesRelations = relations(outcomes, ({ one, many }) => ({
	prediction: one(predictions, {
		fields: [outcomes.prediction],
		references: [predictions.id],
	}),
	bets: many(bets),
}));

export const betsRelations = relations(bets, ({ one, many }) => ({
	user: one(nexus, {
		fields: [bets.user],
		references: [nexus.id],
	}),
	outcome: one(outcomes, {
		fields: [bets.outcome],
		references: [outcomes.id],
	}),
	prediction: one(predictions, {
		fields: [bets.prediction],
		references: [predictions.id],
	}),
	gold: many(gold),
}));

export const attendeesRelations = relations(attendees, ({ one, many }) => ({
	event: one(events, {
		fields: [attendees.event],
		references: [events.id],
	}),
	user: one(nexus, {
		fields: [attendees.user],
		references: [nexus.id],
	}),
	xp: many(xp),
}));

export const roundsRelations = relations(rounds, ({ one, many }) => ({
	awards: many(awards),
	proposals: many(proposals),
	votes: many(votes),
	community: one(communities, {
		fields: [rounds.community],
		references: [communities.id],
	}),
	event: one(events, {
		fields: [rounds.event],
		references: [events.id],
	}),
	minProposerRank: one(ranks, {
		fields: [rounds.minProposerRank],
		references: [ranks.id],
	}),
	minVoterRank: one(ranks, {
		fields: [rounds.minVoterRank],
		references: [ranks.id],
	}),
	creator: one(nexus, {
		fields: [rounds.creator],
		references: [nexus.id],
	}),
}));

export const assetsRelations = relations(assets, ({ many }) => ({
	awards: many(awards),
}));

export const proposalsRelations = relations(proposals, ({ one, many }) => ({
	round: one(rounds, {
		fields: [proposals.round],
		references: [rounds.id],
	}),
	votes: many(votes),
	user: one(nexus, {
		fields: [proposals.user],
		references: [nexus.id],
	}),
	xp: many(xp),
}));

export const nexusRelations = relations(nexus, ({ one, many }) => ({
	votes: many(votes),
	proposals: many(proposals),
	rankings: many(rankings),
	xpRecords: many(xp),
	rank: one(ranks, {
		fields: [nexus.rank],
		references: [ranks.id],
	}),
	creations: many(creations),
	notifications: many(notifications),
	// orders: many(orders),
	carts: many(carts),
	communities: many(communityAdmins),
	rounds: many(rounds),
	events: many(events),
	quests: many(quests),
	predictions: many(predictions),
}));

export const goldRelations = relations(gold, ({ one }) => ({
	from: one(nexus, {
		fields: [gold.from],
		references: [nexus.id],
	}),
	to: one(nexus, {
		fields: [gold.to],
		references: [nexus.id],
	}),
	ranking: one(rankings, {
		fields: [gold.ranking],
		references: [rankings.id],
	}),
	checkin: one(checkins, {
		fields: [gold.checkin],
		references: [checkins.id],
	}),
	prediction: one(predictions, {
		fields: [gold.prediction],
		references: [predictions.id],
	}),
	bet: one(bets, {
		fields: [gold.bet],
		references: [bets.id],
	}),
}));

export const checkinsRelations = relations(checkins, ({ one, many }) => ({
	checkpoint: one(checkpoints, {
		fields: [checkins.checkpoint],
		references: [checkpoints.id],
	}),
	user: one(nexus, {
		fields: [checkins.user],
		references: [nexus.id],
	}),
	gold: many(gold),
	xp: many(xp),
}));

export const awardsRelations = relations(awards, ({ one }) => ({
	round: one(rounds, {
		fields: [awards.round],
		references: [rounds.id],
	}),
	asset: one(assets, {
		fields: [awards.asset],
		references: [assets.id],
	}),
}));

export const ranksRelations = relations(ranks, ({ one, many }) => ({
	nexus: many(nexus),
}));

export const questRelations = relations(quests, ({ one, many }) => ({
	community: one(communities, {
		fields: [quests.community],
		references: [communities.id],
	}),
	completed: many(xp),
	event: one(events, {
		fields: [quests.event],
		references: [events.id],
	}),
	creator: one(nexus, {
		fields: [quests.creator],
		references: [nexus.id],
	}),
}));

export const xpRelations = relations(xp, ({ one }) => ({
	user: one(nexus, {
		fields: [xp.user],
		references: [nexus.id],
	}),
	quest: one(quests, {
		fields: [xp.quest],
		references: [quests.id],
	}),
	snaphot: one(snapshots, {
		fields: [xp.snapshot],
		references: [snapshots.id],
	}),
	checkin: one(checkins, {
		fields: [xp.checkin],
		references: [checkins.id],
	}),
	prediction: one(predictions, {
		fields: [xp.prediction],
		references: [predictions.id],
	}),
	vote: one(votes, {
		fields: [xp.vote],
		references: [votes.id],
	}),
	proposal: one(proposals, {
		fields: [xp.proposal],
		references: [proposals.id],
	}),
	attendee: one(attendees, {
		fields: [xp.attendee],
		references: [attendees.id],
	}),
	// order: one(orders, {
	// 	fields: [xp.order],
	// 	references: [orders.id],
	// }),
}));

export const rankingsRelations = relations(rankings, ({ one, many }) => ({
	user: one(nexus, {
		fields: [rankings.user],
		references: [nexus.id],
	}),
	rank: one(ranks, {
		fields: [rankings.rank],
		references: [ranks.id],
	}),
	gold: one(gold, {
		fields: [rankings.gold],
		references: [gold.id],
	}),
}));

export const votesRelations = relations(votes, ({ one, many }) => ({
	proposal: one(proposals, {
		fields: [votes.proposal],
		references: [proposals.id],
	}),
	round: one(rounds, {
		fields: [votes.round],
		references: [rounds.id],
	}),
	user: one(nexus, {
		fields: [votes.user],
		references: [nexus.id],
	}),
	xp: many(xp),
}));

export const creationsRelations = relations(creations, ({ one }) => ({
	original: one(creations, {
		fields: [creations.original],
		references: [creations.id],
	}),
	creator: one(nexus, {
		fields: [creations.creator],
		references: [nexus.id],
	}),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
	collection: one(collections, {
		fields: [products.collection],
		references: [collections.id],
	}),
	event: one(events, {
		fields: [products.event],
		references: [events.id],
	}),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
	products: many(products),
}));

export const cartsRelations = relations(carts, ({ one }) => ({
	user: one(nexus, {
		fields: [carts.user],
		references: [nexus.id],
	}),
	product: one(products, {
		fields: [carts.product],
		references: [products.id],
	}),
}));

// export const erc721BalancesRelations = relations(
// 	erc721Balances,
// 	({ one, many }) => ({
// 		nounDelegates: many(nounDelegates),
// 		lilnounDelegates: many(lilnounDelegates),
// 	}),
// );

// export const nounDelegatesRelations = relations(
// 	nounDelegates,
// 	({ one, many }) => ({
// 		delegator: one(erc721Balances, {
// 			fields: [nounDelegates.from],
// 			references: [erc721Balances.account],
// 		}),
// 		delegatee: one(erc721Balances, {
// 			fields: [nounDelegates.to],
// 			references: [erc721Balances.account],
// 		}),

// 	}),
// );

// export const lilnounDelegatesRelations = relations(
// 	lilnounDelegates,
// 	({ one, many }) => ({
// 		delegator: one(erc721Balances, {
// 			fields: [lilnounDelegates.from],
// 			references: [erc721Balances.account],
// 		}),
// 		delegatee: one(erc721Balances, {
// 			fields: [lilnounDelegates.to],
// 			references: [erc721Balances.account],
// 		}),
// 	}),
// );

export const nounsProposalsRelations = relations(
	nounsProposals,
	({ one, many }) => ({
		nounsVotes: many(nounsVotes),
	}),
);

export const nounsVotesRelations = relations(nounsVotes, ({ one }) => ({
	proposal: one(nounsProposals, {
		fields: [nounsVotes.proposal],
		references: [nounsProposals.id],
	}),
}));

export const nounsRelations = relations(nouns, ({ one, many }) => ({
	accessory: one(nounsTraits, {
		fields: [nouns.accessory],
		references: [nounsTraits.id],
	}),
	body: one(nounsTraits, {
		fields: [nouns.body],
		references: [nounsTraits.id],
	}),
	head: one(nounsTraits, {
		fields: [nouns.head],
		references: [nounsTraits.id],
	}),
	glasses: one(nounsTraits, {
		fields: [nouns.glasses],
		references: [nounsTraits.id],
	}),
}));

// There is not enough information to infer relation "rounds.proposerCredentialHolders"

export const nounsTraitsRelations = relations(nounsTraits, ({ many }) => ({
	nouns: many(nouns),
}));

export const rafflesRelations = relations(raffles, ({ many, one }) => ({
	entries: many(raffleEntries),
	event: one(events, {
		fields: [raffles.event],
		references: [events.id],
	}),
}));

export const raffleEntriesRelations = relations(raffleEntries, ({ one }) => ({
	raffle: one(raffles, {
		fields: [raffleEntries.raffle],
		references: [raffles.id],
	}),
	user: one(nexus, {
		fields: [raffleEntries.user],
		references: [nexus.id],
	}),
}));
