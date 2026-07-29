import {
	articles,
	collections,
	communities,
	events,
	predictions,
	products,
	profiles,
	quests,
	raffles,
	rounds,
} from "./archive";

export const communityParams = communities.map((community) => ({
	community: community.handle,
}));

export const articleParams = articles.map((article) => ({
	community: article.community.handle,
	article: article.handle,
}));

export const eventParams = events.map((event) => ({
	community: event.community.handle,
	event: event.handle,
}));

export const roundParams = rounds.map((round) => ({
	community: round.community.handle,
	round: round.handle,
}));

export const questParams = quests.map((quest) => ({
	community: quest.community.handle,
	quest: quest.handle,
}));

export const predictionParams = predictions.map((prediction) => ({
	community: prediction.community.handle,
	prediction: prediction.handle,
}));

export const raffleParams = raffles.map((raffle) => ({
	raffle: raffle.handle,
}));

export const productParams = products.map((product) => ({
	product: product.handle,
}));

export const collectionParams = collections.map((collection) => ({
	collection: collection.handle,
}));

export const profileParams = profiles.map((profile) => ({
	user: profile.id,
}));
