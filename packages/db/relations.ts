import { relations } from "drizzle-orm";
import {
	snapshots,
	nexus,
	communities,
	rounds,
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
	assets,
	carts,
	gold,
	collections,
	raffles,
	raffleEntries,
	communityAdmins,
	productVariants,
	questCompletions,
	questActions,
	roundActions,
	eventActions,
	leaderboards,
	communityPlugins,
	accounts,
	escrows,
	articles,
	orders,
	purchasedVotes,
} from "./schema/public";
import {
	nounsProposals,
	nounsVotes,
	nounsTraits,
	nouns,
} from "./schema/indexer";

export const articlesRelations = relations(articles, ({ one }) => ({
	community: one(communities, {
		fields: [articles.community],
		references: [communities.id],
	}),
}));

export const snapshotsRelations = relations(snapshots, ({ one }) => ({
	user: one(nexus, {
		fields: [snapshots.user],
		references: [nexus.id],
	}),
}));

export const communityRelations = relations(communities, ({ one, many }) => ({
	rounds: many(rounds),
	events: many(events),
	quests: many(quests),
	admins: many(communityAdmins),
	predictions: many(predictions),
	plugins: many(communityPlugins),
	articles: many(articles),
	raffles: many(raffles),
	products: many(products),
}));

export const communityPluginsRelations = relations(
	communityPlugins,
	({ one }) => ({
		community: one(communities, {
			fields: [communityPlugins.community],
			references: [communities.id],
		}),
	}),
);

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

export const escrowsRelations = relations(escrows, ({ one, many }) => ({
	heir: one(accounts, {
		fields: [escrows.heir],
		references: [accounts.id],
	}),
	gold: many(gold),
}));

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
	actions: many(eventActions),
}));

export const eventActionsRelations = relations(eventActions, ({ one }) => ({
	event: one(events, {
		fields: [eventActions.event],
		references: [events.id],
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
	earnedXP: many(xp),
	gold: many(gold),
	community: one(communities, {
		fields: [predictions.community],
		references: [communities.id],
	}),
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
	actions: many(roundActions),
	purchasedVotes: many(purchasedVotes),
}));

export const roundActionsRelations = relations(roundActions, ({ one }) => ({
	round: one(rounds, {
		fields: [roundActions.round],
		references: [rounds.id],
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
	xp: many(xp),
	gold: many(gold),
	carts: many(carts),
	leaderboards: many(leaderboards),
	accounts: many(accounts),
	purchasedVotes: many(purchasedVotes),
	bets: many(bets),
	questCompletions: many(questCompletions),
	orders: many(orders),
	raffleEntries: many(raffleEntries),
	checkins: many(checkins),
	admins: many(communityAdmins),
	attendees: many(attendees),
	snapshots: many(snapshots),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(nexus, {
		fields: [accounts.user],
		references: [nexus.id],
	}),
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
	fromEscrow: one(nexus, {
		fields: [gold.fromEscrow],
		references: [nexus.id],
	}),
	toEscrow: one(nexus, {
		fields: [gold.toEscrow],
		references: [nexus.id],
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
	raffleEntry: one(raffleEntries, {
		fields: [gold.raffleEntry],
		references: [raffleEntries.id],
	}),
	quest: one(quests, {
		fields: [gold.quest],
		references: [quests.id],
	}),
	order: one(orders, {
		fields: [gold.order],
		references: [orders.id],
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

export const questRelations = relations(quests, ({ one, many }) => ({
	community: one(communities, {
		fields: [quests.community],
		references: [communities.id],
	}),
	event: one(events, {
		fields: [quests.event],
		references: [events.id],
	}),
	completions: many(questCompletions),
	actions: many(questActions),
	xpRecords: many(xp),
}));

export const questCompletionsRelations = relations(
	questCompletions,
	({ one }) => ({
		quest: one(quests, {
			fields: [questCompletions.quest],
			references: [quests.id],
		}),
		user: one(nexus, {
			fields: [questCompletions.user],
			references: [nexus.id],
		}),
	}),
);

export const questActionsRelations = relations(questActions, ({ one }) => ({
	quest: one(quests, {
		fields: [questActions.quest],
		references: [quests.id],
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
	order: one(orders, {
		fields: [xp.order],
		references: [orders.id],
	}),
	community: one(communities, {
		fields: [xp.community],
		references: [communities.id],
	}),
}));

export const leaderboardsRelations = relations(leaderboards, ({ one }) => ({
	user: one(nexus, {
		fields: [leaderboards.user],
		references: [nexus.id],
	}),
	community: one(communities, {
		fields: [leaderboards.community],
		references: [communities.id],
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

export const productsRelations = relations(products, ({ one, many }) => ({
	collection: one(collections, {
		fields: [products.collection],
		references: [collections.id],
	}),
	event: one(events, {
		fields: [products.event],
		references: [events.id],
	}),
	community: one(communities, {
		fields: [products.community],
		references: [communities.id],
	}),
	variants: many(productVariants),
}));

export const productVariantsRelations = relations(
	productVariants,
	({ one, many }) => ({
		product: one(products, {
			fields: [productVariants.product],
			references: [products.id],
		}),
		carts: many(carts),
	}),
);

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
	variant: one(productVariants, {
		fields: [carts.variant],
		references: [productVariants.id],
	}),
}));

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

export const nounsTraitsRelations = relations(nounsTraits, ({ many }) => ({
	nouns: many(nouns),
}));

export const rafflesRelations = relations(raffles, ({ many, one }) => ({
	entries: many(raffleEntries),
	event: one(events, {
		fields: [raffles.event],
		references: [events.id],
	}),
	community: one(communities, {
		fields: [raffles.community],
		references: [communities.id],
	}),
}));

export const raffleEntriesRelations = relations(
	raffleEntries,
	({ one, many }) => ({
		raffle: one(raffles, {
			fields: [raffleEntries.raffle],
			references: [raffles.id],
		}),
		user: one(nexus, {
			fields: [raffleEntries.user],
			references: [nexus.id],
		}),
		gold: many(gold),
	}),
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
	user: one(nexus, {
		fields: [orders.user],
		references: [nexus.id],
	}),
	xp: many(xp),
}));

export const purchasedVotesRelations = relations(purchasedVotes, ({ one }) => ({
	user: one(nexus, {
		fields: [purchasedVotes.user],
		references: [nexus.id],
	}),
	round: one(rounds, {
		fields: [purchasedVotes.round],
		references: [rounds.id],
	}),
}));
