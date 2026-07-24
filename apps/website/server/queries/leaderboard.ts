import {
	communities,
	getLeaderboardForCommunity,
} from "@/server/data/archive";

function communityHandle(idOrHandle: string) {
	return (
		communities.find(
			(community) =>
				community.id === idOrHandle || community.handle === idOrHandle,
		)?.handle ?? idOrHandle
	);
}

export async function getLeaderboard(input: { community: string }) {
	return getLeaderboardForCommunity(communityHandle(input.community)).slice(
		0,
		100,
	);
}

export async function getRank(input: { user: string; community: string }) {
	return getLeaderboardForCommunity(communityHandle(input.community)).find(
		(entry) => entry.userId === input.user,
	);
}
