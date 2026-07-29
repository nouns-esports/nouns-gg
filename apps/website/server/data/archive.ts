import "server-only";

import {
	articlesJson,
	awardsJson,
	collectionsJson,
	communitiesJson,
	eventsJson,
	latestNounJson,
	leaderboardFiles,
	manifestJson,
	outcomesJson,
	predictionsJson,
	productsJson,
	profilesJson,
	proposalsJson,
	questsJson,
	rafflesJson,
	roundsJson,
	traitsJson,
	voteFiles,
} from "./archive-assets.generated";

type JsonObject = Record<string, any>;

function reviveDates<T>(value: T): T {
	if (typeof value === "string") {
		if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
			const date = new Date(value);
			if (!Number.isNaN(date.getTime())) return date as T;
		}
		return value;
	}
	if (Array.isArray(value)) {
		return value.map((entry) => reviveDates(entry)) as T;
	}
	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, entry]) => [key, reviveDates(entry)]),
		) as T;
	}
	return value;
}

export const manifest: any = reviveDates(manifestJson);
export const communities: any[] = reviveDates(communitiesJson);
export const articles: any[] = reviveDates(articlesJson);
export const events: any[] = reviveDates(eventsJson);
export const rounds: any[] = reviveDates(roundsJson);
export const predictions: any[] = reviveDates(predictionsJson);
export const quests: any[] = reviveDates(questsJson);
export const raffles: any[] = reviveDates(rafflesJson);
export const products: any[] = reviveDates(productsJson);
export const collections: any[] = reviveDates(collectionsJson);
export const profiles: any[] = reviveDates(profilesJson);
export const proposals: any[] = reviveDates(proposalsJson);
export const awards: any[] = reviveDates(awardsJson);
export const outcomes: any[] = reviveDates(outcomesJson);
export const traits: any[] = reviveDates(traitsJson);
export const latestNoun: any = reviveDates(latestNounJson);
const votesByFile = reviveDates(voteFiles) as Record<string, JsonObject[]>;
const leaderboardsByHandle = reviveDates(leaderboardFiles) as Record<
	string,
	JsonObject[]
>;

const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
const communityById = new Map(
	communities.map((community) => [community.id, community]),
);
const eventById = new Map(events.map((event) => [event.id, event]));
const proposalById = new Map(
	proposals.map((proposal) => [proposal.id, proposal]),
);

export function publicProfile(id: string | undefined): any {
	if (!id) return undefined;
	const profile = profileById.get(id);
	if (!profile) return undefined;
	return {
		...profile,
		twitter: profile.twitter?.username ?? null,
		twitterProfile: profile.twitter ?? null,
	};
}

export function getVotesForRound(roundId: string): any[] {
	return votesByFile[safeFilePart(roundId)] ?? [];
}

export function getLeaderboardForCommunity(handle: string): any[] {
	const entries = leaderboardsByHandle[safeFilePart(handle)] ?? [];
	return entries.map((entry, index) => ({
		...entry,
		rank: index + 1,
		community: communityById.get(entry.communityId),
		user: publicProfile(entry.userId),
	}));
}

export function expandedRound(round: any): any {
	const roundProposals = proposals
		.filter((proposal) => proposal.roundId === round.id)
		.map((proposal) => ({
			...proposal,
			user: publicProfile(proposal.userId),
			totalVotes: getVotesForRound(round.id)
				.filter((vote) => vote.proposalId === proposal.id)
				.reduce((total, vote) => total + Number(vote.count), 0),
		}));
	const expandedVotes = getVotesForRound(round.id).map((vote) => {
		const proposal = proposalById.get(vote.proposalId);
		return {
			...vote,
			user: publicProfile(vote.userId),
			proposal: proposal
				? {
						...proposal,
						user: publicProfile(proposal.userId),
					}
				: undefined,
		};
	});
	return {
		...round,
		event: round.eventId ? eventById.get(round.eventId) : null,
		proposals: roundProposals,
		votes: expandedVotes.slice(-100).reverse(),
		purchasedVotes: [],
		awards: awards.filter((award) => award.roundId === round.id),
		actions: [],
		uniqueVoters: new Set(expandedVotes.map((vote) => vote.userId)).size,
		uniqueProposers: new Set(roundProposals.map((proposal) => proposal.userId))
			.size,
		community: {
			...round.community,
			admins: [],
			plugins: [],
		},
	};
}

export function expandedPrediction(prediction: any): any {
	return {
		...prediction,
		event: prediction.eventId
			? eventById.get(prediction.eventId)
			: null,
		outcomes: outcomes.filter(
			(outcome) => outcome.predictionId === prediction.id,
		),
		bets: [],
		gold: [],
	};
}

export function expandedEvent(event: any): any {
	return {
		...event,
		attendees: [],
		hasRounds: rounds.some((round) => round.eventId === event.id),
		hasQuests: quests.some((quest) => quest.eventId === event.id),
		hasPredictions: predictions.some(
			(prediction) => prediction.eventId === event.id,
		),
		hasShop:
			products.some((product) => product.eventId === event.id) ||
			raffles.some((raffle) => raffle.eventId === event.id),
	};
}

export function expandedQuest(quest: any): any {
	return {
		...quest,
		event: quest.eventId ? eventById.get(quest.eventId) : null,
		completions: [],
		actions: [],
		community: {
			...quest.community,
			admins: [],
			plugins: [],
		},
	};
}

function safeFilePart(value: string) {
	const safe = value.toLowerCase().replaceAll(/[^a-z0-9._-]+/g, "-");
	if (!safe || safe === "." || safe === "..") {
		throw new Error("Invalid public route key");
	}
	return safe;
}
