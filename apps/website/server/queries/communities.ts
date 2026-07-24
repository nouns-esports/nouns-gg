import { communities } from "@/server/data/archive";

export async function getCommunities(input?: {
	featured?: boolean;
	limit?: number;
}) {
	const result = communities
		.filter((community) => !input?.featured || community.featured)
		.sort((a, b) => a.name.localeCompare(b.name));
	return input?.limit ? result.slice(0, input.limit) : result;
}

export async function getCommunity(input: { handle: string }) {
	return communities.find((community) => community.handle === input.handle);
}
