export type Achievement = {
	id: string;
	name: string;
	description: string;
	image: string;
	xp: number;
};

export const achievements: Record<string, Achievement> = {
	enterNexus: {
		id: "enterNexus",
		name: "Enter the Nexus",
		description: "Begin your Nouns Esports journey",
		image: "/logo/logo-square.png",
		xp: 0,
	},
	connectFarcaster: {
		id: "connectFarcaster",
		name: "Connect Farcaster",
		description: "Connect a Farcaster account to your profile",
		image:
			"https://ipfs.nouns.gg/ipfs/QmRjMR3EPSWhvs92VQZFTNZGDf6x1t3R2HDACh99t7ctvY",
		xp: 250,
	},
	connectDiscord: {
		id: "connectDiscord",
		name: "Connect Discord",
		description: "Connect a Discord account to your profile",
		image:
			"https://ipfs.nouns.gg/ipfs/Qmdr53EbSCYs3jYod3NJF5PuTHF1tPW96bEYkK2z6Xc4yT",
		xp: 200,
	},
	joinServer: {
		id: "joinServer",
		name: "Join the Discord Server",
		description: "Join our community Discord server",
		image:
			"https://ipfs.nouns.gg/ipfs/QmeEab8zrjsY7gPw4CEqTLxmdVck3JvhrskuJDRegvsMh3",
		xp: 250,
	},
	attendCall: {
		id: "attendCall",
		name: "Attend a community call",
		description: "Attend the weekly community call in our Discord server",
		image:
			"https://ipfs.nouns.gg/ipfs/QmS654Bm585TcoJpF7DuL1FC7REb9ntxjJkmpWK2L6pEuZ",
		xp: 300,
	},
	connectWallet: {
		id: "connectWallet",
		name: "Connect Wallet",
		description: "Connect a wallet to your profile",
		image:
			"https://ipfs.nouns.gg/ipfs/QmQxxdw7GqszLAZ6HqR8FWv5Lva9qq7iD3mT1bdCp2aPE3",
		xp: 300,
	},
	createProposal: {
		id: "createProposal",
		name: "Create your first Proposal",
		description: "Create your first proposal",
		image:
			"https://ipfs.nouns.gg/ipfs/QmZXCtrxYvMhMDuryUhTiQYA85vkEhFdcLHbUrLZFsV1wK",
		xp: 150,
	},
	getAVote: {
		id: "getAVote",
		name: "Get a vote on your proposal",
		description: "Get a vote on your proposal",
		image:
			"https://ipfs.nouns.gg/ipfs/QmYveqUvMiMFcqWXN1yGWKZv9jT4fujiZCM6Bij1cWuNhV",
		xp: 200,
	},
	tenVoters: {
		id: "tenVoters",
		name: "10 unique voters on your proposal",
		description: "Get votes from 10 unique voters on a single proposal",
		image:
			"https://ipfs.nouns.gg/ipfs/QmZZsQGVMqd1znAPzXTv8aSJLZc8V5dtn9RiBpNMEH88Sz",
		xp: 400,
	},
	winARound: {
		id: "winARound",
		name: "Win a round",
		description: "Win a round",
		image:
			"https://ipfs.nouns.gg/ipfs/QmUmmd9xzDZWgvkhtNjiyTBtwDgP491caZcpe9F3wcSzxW",
		xp: 500,
	},
	placeFirst: {
		id: "placeFirst",
		name: "Place 1st in a round",
		description: "Place 1st in a round",
		image:
			"https://ipfs.nouns.gg/ipfs/QmdEiVsfSwWiDvKafCWv1nkFeZBVUCY3Bcef4zdq641p2X",
		xp: 600,
	},
	connectX: {
		id: "connectX",
		name: "Connect X",
		description: "Connect an X account to your profile",
		image:
			"https://ipfs.nouns.gg/ipfs/Qmeks4Fyscak18kskcsMP1YgEvjtiPzWNk7g1h8c5E1At9",
		xp: 200,
	},
	reachExplorer: {
		id: "reachExplorer",
		name: "Reach Explorer",
		description: "Reach the Explorer rank",
		image:
			"https://ipfs.nouns.gg/ipfs/QmRSvaTR55WMnjy6J4WDqYEkUSdffyd7gaaY2jm1mgVJmz",
		xp: 100,
	},
	reachChallenger: {
		id: "reachChallenger",
		name: "Reach Challenger",
		description: "Reach the Challenger rank",
		image:
			"https://ipfs.nouns.gg/ipfs/QmbTy1UNeardoRz2iaWJSqXZ97bDqYxAtBa8KhZ1SJNw5S",
		xp: 250,
	},
	reachChampion: {
		id: "reachChampion",
		name: "Reach Champion",
		description: "Reach the Champion rank",
		image:
			"https://ipfs.nouns.gg/ipfs/QmPfyBKcFsAEnJT4YfqRUf2qKCSXaaee1Ld9z99ZYetS8h",
		xp: 500,
	},
	completeQuest: {
		id: "completeQuest",
		name: "Complete your first quest",
		description: "Complete your first quest",
		image:
			"https://ipfs.nouns.gg/ipfs/QmUdsi8KvvFyQVvk4FrzE5u2856pW7gw3t8yPLYvTrE54n",
		xp: 100,
	},
	castVote: {
		id: "castVote",
		name: "Cast your first vote",
		description: "Cast your first vote",
		image:
			"https://ipfs.nouns.gg/ipfs/QmQgZf1f7orqjeRpNCgNGTFBhshDdX3mUMZubeN5CVdQVR",

		xp: 100,
	},
	castVoteWinningProposal: {
		id: "castVoteWinningProposal",
		name: "Cast a vote on a winning proposal",
		description: "Cast a vote on a proposal that ended up winning the round",
		image:
			"https://ipfs.nouns.gg/ipfs/QmZ9h5CSssYyVqmDA8r4zVFyXY4KkK9EdhCxfhJEPiv7Rx",
		xp: 250,
	},
};

export type AchievementTree = Achievement & {
	next?: AchievementTree | AchievementTree[];
};

export const achievementTree: AchievementTree = {
	...achievements.enterNexus,
	next: [
		{
			...achievements.connectFarcaster,
		},
		{
			...achievements.connectDiscord,
			next: {
				...achievements.joinServer,
				next: {
					...achievements.attendCall,
				},
			},
		},
		{
			...achievements.connectWallet,
		},
		{
			...achievements.createProposal,
			next: [
				{
					...achievements.getAVote,
					next: {
						...achievements.tenVoters,
					},
				},
				{
					...achievements.winARound,
					next: {
						...achievements.placeFirst,
					},
				},
			],
		},
		{
			...achievements.connectX,
		},
		{
			...achievements.reachExplorer,
			next: {
				...achievements.reachChallenger,
				next: {
					...achievements.reachChampion,
				},
			},
		},

		{
			...achievements.castVote,
			next: {
				...achievements.castVoteWinningProposal,
			},
		},
		{
			...achievements.completeQuest,
		},
	],
};
