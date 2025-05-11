import Link from "@/components/Link";
import Gallery from "@/components/Gallery";
import { ArrowRight } from "lucide-react";
import { getRounds } from "@/server/queries/rounds";
import { getAuthenticatedUser } from "@/server/queries/users";
import CreatePost from "@/components/CreatePost";
import { getPosts } from "@/server/queries/posts";
import PostCard from "@/components/PostCard";
import { getCommunities } from "@/server/queries/communities";
import Feed from "@/components/Feed";
import { getQuests } from "@/server/queries/quests";
import { getPredictions } from "@/server/queries/predictions";
import { getEvents } from "@/server/queries/events";

const posts = [
	{
		id: "0196bab4-82fa-724b-bb0a-cab7385f547d",
		createdAt: new Date("2025-05-10T14:58:34.353Z"),
		updatedAt: new Date("2025-05-10T14:58:34.353Z"),
		deletedAt: null,
		timestamp: new Date("2025-05-10T14:58:33.000Z"),
		fid: 11500,
		hash: "0x41c1289e4156bb35688696678481656d3b85b592",
		text: "If you enjoy any of these games, consider giving them a vote here\nhttps://nouns.gg/rounds/game-jam?user=did:privy:clx8g9mui0c1k10947grzks2a",
		parentHash: null,
		parentFid: null,
		parentUrl: "https://nouns.gg",
		rootParentHash: "0x41c1289e4156bb35688696678481656d3b85b592",
		rootParentUrl: "https://nouns.gg",
		embeddedUrls: [
			"https://nouns.gg/rounds/game-jam?user=did:privy:clx8g9mui0c1k10947grzks2a",
		],
		embeddedCasts: ["0x8eed9f6c39ed33a494ccfba33e3ebbdc2a4375a5"],
		mentions: null,
		mentionsPositions: null,
		tickerMentions: null,
		tickerMentionsPositions: null,
		channelMentions: null,
		channelMentionsPositions: null,
		embeddedCastsFids: [307654],
		embeds:
			"[{'castId': {'fid': 307654, 'hash': {'data': [142, 237, 159, 108, 57, 237, 51, 164, 148, 204, 251, 163, 62, 62, 187, 220, 42, 67, 117, 165], 'type': 'Buffer'}}}, {'url': 'https://nouns.gg/rounds/game-jam?user=did:privy:clx8g9mui0c1k10947grzks2a'}]",
		creatorAppFid: 9152,
		deleterAppFid: null,
		round: null,
		likesCount: "6",
		recastsCount: "0",
		commentsCount: "0",
		creator: {
			id: "0190d03c-4ef4-b830-95e3-aef3773693fe",
			createdAt: new Date("2024-09-27T17:53:22.925Z"),
			updatedAt: new Date("2025-05-06T00:54:13.485Z"),
			deletedAt: null,
			fid: 11500,
			bio: "Head Gamemaker @esports / nouns.gg",
			pfpUrl:
				"https://supercast.mypinata.cloud/ipfs/QmVyxpCxueQ8BKEVgew9f9kN8wjP9CnFgdfECq1D6aJeJ2?filename=IMG_0458.png",
			url: null,
			username: "sams",
			displayName: "Sam",
			location: "geo:40.51,-88.99",
			latitude: 40.51,
			longitude: -88.99,
			primaryEthAddress: "0xc2fda88c8706e5f3ec92ec2d13889567a7e3d7bb",
			primarySolAddress:
				"0x9a7d7f1eec9d9c907b149ddbffe61062a38ade3ace95b6bd17c91e9a0102549a",
		},
		community: {
			id: 7,
			handle: "nouns-gg",
			image: "https://i.imgur.com/ZeGD2QF.jpg",
			name: "Nouns GG",
			description: null,
			parentUrl: "https://nouns.gg",
			gold: 13500,
		},
	},
	{
		id: "0196b55e-2f90-edd2-654b-9c5020d5846f",
		createdAt: new Date("2025-05-09T14:06:10.822Z"),
		updatedAt: new Date("2025-05-09T14:06:10.822Z"),
		deletedAt: null,
		timestamp: new Date("2025-05-09T14:06:09.000Z"),
		fid: 11500,
		hash: "0xb5e768f88bb243e9361bf0ea084fad5813c712d3",
		text: "😆",
		parentHash: "0xdc3537bf672469e5761ef987285ad559fd5e8455",
		parentFid: 214447,
		parentUrl: null,
		rootParentHash: "0xef440f550d88730ff7a3b5cc4f660c5db74d03cd",
		rootParentUrl: "https://warpcast.com/~/channel/farcade",
		embeddedUrls: null,
		embeddedCasts: null,
		mentions: null,
		mentionsPositions: null,
		tickerMentions: null,
		tickerMentionsPositions: null,
		channelMentions: null,
		channelMentionsPositions: null,
		embeddedCastsFids: null,
		embeds: null,
		creatorAppFid: 9152,
		deleterAppFid: null,
		round: null,
		likesCount: "1",
		recastsCount: "0",
		commentsCount: "0",
		creator: {
			id: "0190d03c-4ef4-b830-95e3-aef3773693fe",
			createdAt: new Date("2024-09-27T17:53:22.925Z"),
			updatedAt: new Date("2025-05-06T00:54:13.485Z"),
			deletedAt: null,
			fid: 11500,
			bio: "Head Gamemaker @esports / nouns.gg",
			pfpUrl:
				"https://supercast.mypinata.cloud/ipfs/QmVyxpCxueQ8BKEVgew9f9kN8wjP9CnFgdfECq1D6aJeJ2?filename=IMG_0458.png",
			url: null,
			username: "sams",
			displayName: "Sam",
			location: "geo:40.51,-88.99",
			latitude: 40.51,
			longitude: -88.99,
			primaryEthAddress: "0xc2fda88c8706e5f3ec92ec2d13889567a7e3d7bb",
			primarySolAddress:
				"0x9a7d7f1eec9d9c907b149ddbffe61062a38ade3ace95b6bd17c91e9a0102549a",
		},
		community: null,
	},
	{
		id: "0196b53a-35cc-b2bd-4bf6-c30fe1e73657",
		createdAt: new Date("2025-05-09T13:26:53.118Z"),
		updatedAt: new Date("2025-05-09T13:26:53.118Z"),
		deletedAt: null,
		timestamp: new Date("2025-05-09T13:26:51.000Z"),
		fid: 11500,
		hash: "0xef440f550d88730ff7a3b5cc4f660c5db74d03cd",
		text: "🕹️ The Nouns x Farcade gamejam is now open for voting ⌐◨-◨\n\nGo check out the round below to see all of the amazing games that were created and vote on your favorites!\nhttps://nouns.gg/rounds/game-jam",
		parentHash: null,
		parentFid: null,
		parentUrl: "https://warpcast.com/~/channel/farcade",
		rootParentHash: "0xef440f550d88730ff7a3b5cc4f660c5db74d03cd",
		rootParentUrl: "https://warpcast.com/~/channel/farcade",
		embeddedUrls: ["https://nouns.gg/rounds/game-jam"],
		embeddedCasts: null,
		mentions: null,
		mentionsPositions: null,
		tickerMentions: null,
		tickerMentionsPositions: null,
		channelMentions: null,
		channelMentionsPositions: null,
		embeddedCastsFids: null,
		embeds: "[{'url': 'https://nouns.gg/rounds/game-jam'}]",
		creatorAppFid: 9152,
		deleterAppFid: null,
		round: {
			handle: "game-jam",
			name: "Nouns x Farcade Game Jam",
			image:
				"https://ipfs.nouns.gg/ipfs/bafkreiezldni7pe77te56fhtjem7tbnankmaqhtuytffvyywh6vftgub2y",
			type: "url",
			featured: true,
			content:
				'{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Nouns GG","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" and ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Farcade","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://farcade.ai/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" are teaming up to run a Nouns themed game jam!","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"What is Nouns?","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Nouns","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://www.youtube.com/watch?v=lOzCA7bZG_k"},{"detail":0,"format":0,"mode":"normal","style":"","text":" is a community-owned brand. All Nouns artwork is CC0-licensed, so it’s entirely open-source for anyone to use or remix. One Noun goes up for auction every day, fueling creative projects and supporting a brand that anyone can freely build on and join.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"How to enter?","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Create a Nouns themed game using ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Farcade\'s studio","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://app.farcade.ai"},{"detail":0,"format":0,"mode":"normal","style":"","text":" and share the link to play it in your proposal.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Prizing","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"We are distributing ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"$800","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" to the top 10 submissions that get voted on by the community. Additionally, the top 10 submissions will receive ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"10k Farcade Points","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" each.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Where can I find assets for my game?","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Below is a list of websites with assets you can freely use or remix in your games.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CC0-LIB","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://cc0-lib.wtf/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Voadz","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/voadz"},{"detail":0,"format":0,"mode":"normal","style":"","text":" and ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"NeroOne","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/n1"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (2D assets)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"3D Nouns","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://3dnouns.com/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CoralOrca","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/coralorca"},{"detail":0,"format":0,"mode":"normal","style":"","text":" and ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"0xFloyd","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/red"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (3D assets)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Nounish Traits","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://www.figma.com/community/file/1280649696072601487"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Index Card","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/indexcard.eth"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (Figma of all Nouns traits)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Noundry","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://gallery.noundry.wtf/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Volky","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/volky.eth"},{"detail":0,"format":0,"mode":"normal","style":"","text":" and ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CoralOrca","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/coralorca"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (Create custom Nouns traits)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Palettes","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://www.palettes.wtf/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Mike Good","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/mikegood"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (Color palettes)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"3D Buildings","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://nouns-assets-generator.vercel.app/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CoralOrca","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/coralorca"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (3D assets)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":6}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"How do I use these assets in my game?","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Upload your selected asset(s) on the assets tab, then provide ChatGPT with the name of the file and how you want to use it in your game.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}',
			start: "2025-04-15T06:00:00",
			voting_start: "2025-05-09T06:00:00",
			end: "2025-05-16T19:00:00",
			description: null,
			id: 53,
			community: 8,
			event: null,
			draft: false,
			min_title_length: 15,
			max_title_length: 100,
			min_description_length: 0,
			max_description_length: 2000,
			link_regex: null,
			max_proposals: 3,
		},
		likesCount: "21",
		recastsCount: "0",
		commentsCount: "0",
		creator: {
			id: "0190d03c-4ef4-b830-95e3-aef3773693fe",
			createdAt: new Date("2024-09-27T17:53:22.925Z"),
			updatedAt: new Date("2025-05-06T00:54:13.485Z"),
			deletedAt: null,
			fid: 11500,
			bio: "Head Gamemaker @esports / nouns.gg",
			pfpUrl:
				"https://supercast.mypinata.cloud/ipfs/QmVyxpCxueQ8BKEVgew9f9kN8wjP9CnFgdfECq1D6aJeJ2?filename=IMG_0458.png",
			url: null,
			username: "sams",
			displayName: "Sam",
			location: "geo:40.51,-88.99",
			latitude: 40.51,
			longitude: -88.99,
			primaryEthAddress: "0xc2fda88c8706e5f3ec92ec2d13889567a7e3d7bb",
			primarySolAddress:
				"0x9a7d7f1eec9d9c907b149ddbffe61062a38ade3ace95b6bd17c91e9a0102549a",
		},
		community: null,
	},
	{
		id: "0196b536-23c4-5c2a-1bce-969d9fb5438e",
		createdAt: new Date("2025-05-09T13:22:26.356Z"),
		updatedAt: new Date("2025-05-09T13:22:26.356Z"),
		deletedAt: null,
		timestamp: new Date("2025-05-09T13:22:24.000Z"),
		fid: 11500,
		hash: "0xf13cebc2045f60cc5b5604accb98c23a3e7b47e4",
		text: "Likewise!",
		parentHash: "0x86e9621bd92ec3630615f769f77d6cb37ddeae40",
		parentFid: 19640,
		parentUrl: null,
		rootParentHash: "0x6f27d0ca797b1951f3084a5d64b3a98a541e5fcd",
		rootParentUrl:
			"chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
		embeddedUrls: null,
		embeddedCasts: null,
		mentions: null,
		mentionsPositions: null,
		tickerMentions: null,
		tickerMentionsPositions: null,
		channelMentions: null,
		channelMentionsPositions: null,
		embeddedCastsFids: null,
		embeds: null,
		creatorAppFid: 9152,
		deleterAppFid: null,
		round: null,
		likesCount: "1",
		recastsCount: "0",
		commentsCount: "0",
		creator: {
			id: "0190d03c-4ef4-b830-95e3-aef3773693fe",
			createdAt: new Date("2024-09-27T17:53:22.925Z"),
			updatedAt: new Date("2025-05-06T00:54:13.485Z"),
			deletedAt: null,
			fid: 11500,
			bio: "Head Gamemaker @esports / nouns.gg",
			pfpUrl:
				"https://supercast.mypinata.cloud/ipfs/QmVyxpCxueQ8BKEVgew9f9kN8wjP9CnFgdfECq1D6aJeJ2?filename=IMG_0458.png",
			url: null,
			username: "sams",
			displayName: "Sam",
			location: "geo:40.51,-88.99",
			latitude: 40.51,
			longitude: -88.99,
			primaryEthAddress: "0xc2fda88c8706e5f3ec92ec2d13889567a7e3d7bb",
			primarySolAddress:
				"0x9a7d7f1eec9d9c907b149ddbffe61062a38ade3ace95b6bd17c91e9a0102549a",
		},
		community: null,
	},
	{
		id: "0196b530-2a97-382e-01ac-0ad271e8715b",
		createdAt: new Date("2025-05-09T13:15:54.887Z"),
		updatedAt: new Date("2025-05-09T13:15:54.887Z"),
		deletedAt: null,
		timestamp: new Date("2025-05-09T13:15:52.000Z"),
		fid: 11500,
		hash: "0x918c9da169cfc28c033a4754f4b9ad8f8371ef89",
		text: '"Biggest surprise with this gamejam for me is that I actually really like nouns and want to build more with all their awesome free assets"\nhttps://nouns.gg/rounds/game-jam',
		parentHash: null,
		parentFid: null,
		parentUrl:
			"chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
		rootParentHash: "0x918c9da169cfc28c033a4754f4b9ad8f8371ef89",
		rootParentUrl:
			"chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
		embeddedUrls: [
			"https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/03d36fb3-0445-452a-0447-b8b320535200/original",
			"https://nouns.gg/rounds/game-jam",
		],
		embeddedCasts: null,
		mentions: null,
		mentionsPositions: null,
		tickerMentions: null,
		tickerMentionsPositions: null,
		channelMentions: null,
		channelMentionsPositions: null,
		embeddedCastsFids: null,
		embeds:
			"[{'url': 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/03d36fb3-0445-452a-0447-b8b320535200/original'}, {'url': 'https://nouns.gg/rounds/game-jam'}]",
		creatorAppFid: 9152,
		deleterAppFid: null,
		round: {
			handle: "game-jam",
			name: "Nouns x Farcade Game Jam",
			image:
				"https://ipfs.nouns.gg/ipfs/bafkreiezldni7pe77te56fhtjem7tbnankmaqhtuytffvyywh6vftgub2y",
			type: "url",
			featured: true,
			content:
				'{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Nouns GG","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" and ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Farcade","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://farcade.ai/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" are teaming up to run a Nouns themed game jam!","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"What is Nouns?","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Nouns","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://www.youtube.com/watch?v=lOzCA7bZG_k"},{"detail":0,"format":0,"mode":"normal","style":"","text":" is a community-owned brand. All Nouns artwork is CC0-licensed, so it’s entirely open-source for anyone to use or remix. One Noun goes up for auction every day, fueling creative projects and supporting a brand that anyone can freely build on and join.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"How to enter?","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Create a Nouns themed game using ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Farcade\'s studio","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://app.farcade.ai"},{"detail":0,"format":0,"mode":"normal","style":"","text":" and share the link to play it in your proposal.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Prizing","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"We are distributing ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"$800","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" to the top 10 submissions that get voted on by the community. Additionally, the top 10 submissions will receive ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"10k Farcade Points","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" each.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Where can I find assets for my game?","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Below is a list of websites with assets you can freely use or remix in your games.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CC0-LIB","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://cc0-lib.wtf/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Voadz","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/voadz"},{"detail":0,"format":0,"mode":"normal","style":"","text":" and ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"NeroOne","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/n1"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (2D assets)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"3D Nouns","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://3dnouns.com/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CoralOrca","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/coralorca"},{"detail":0,"format":0,"mode":"normal","style":"","text":" and ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"0xFloyd","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/red"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (3D assets)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Nounish Traits","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://www.figma.com/community/file/1280649696072601487"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Index Card","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/indexcard.eth"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (Figma of all Nouns traits)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Noundry","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://gallery.noundry.wtf/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Volky","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/volky.eth"},{"detail":0,"format":0,"mode":"normal","style":"","text":" and ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CoralOrca","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/coralorca"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (Create custom Nouns traits)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Palettes","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://www.palettes.wtf/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Mike Good","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/mikegood"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (Color palettes)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"3D Buildings","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://nouns-assets-generator.vercel.app/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CoralOrca","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/coralorca"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (3D assets)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":6}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"How do I use these assets in my game?","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Upload your selected asset(s) on the assets tab, then provide ChatGPT with the name of the file and how you want to use it in your game.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}',
			start: "2025-04-15T06:00:00",
			voting_start: "2025-05-09T06:00:00",
			end: "2025-05-16T19:00:00",
			description: null,
			id: 53,
			community: 8,
			event: null,
			draft: false,
			min_title_length: 15,
			max_title_length: 100,
			min_description_length: 0,
			max_description_length: 2000,
			link_regex: null,
			max_proposals: 3,
		},
		likesCount: "45",
		recastsCount: "0",
		commentsCount: "0",
		creator: {
			id: "0190d03c-4ef4-b830-95e3-aef3773693fe",
			createdAt: new Date("2024-09-27T17:53:22.925Z"),
			updatedAt: new Date("2025-05-06T00:54:13.485Z"),
			deletedAt: null,
			fid: 11500,
			bio: "Head Gamemaker @esports / nouns.gg",
			pfpUrl:
				"https://supercast.mypinata.cloud/ipfs/QmVyxpCxueQ8BKEVgew9f9kN8wjP9CnFgdfECq1D6aJeJ2?filename=IMG_0458.png",
			url: null,
			username: "sams",
			displayName: "Sam",
			location: "geo:40.51,-88.99",
			latitude: 40.51,
			longitude: -88.99,
			primaryEthAddress: "0xc2fda88c8706e5f3ec92ec2d13889567a7e3d7bb",
			primarySolAddress:
				"0x9a7d7f1eec9d9c907b149ddbffe61062a38ade3ace95b6bd17c91e9a0102549a",
		},
		community: null,
	},
	{
		id: "0196b527-238c-0482-4cb3-213cbf5c1744",
		createdAt: new Date("2025-05-09T13:06:03.267Z"),
		updatedAt: new Date("2025-05-09T13:06:03.267Z"),
		deletedAt: null,
		timestamp: new Date("2025-05-09T13:06:01.000Z"),
		fid: 11500,
		hash: "0x10c498d6985b6f48846d51b3d329f5c32acfb77e",
		text: "A community governed contest to decide which proposers should receive a Noun delegation and participate in the greater DAO",
		parentHash: "0x80fd440a3506a5a4456850160339f9de78098d1e",
		parentFid: 19640,
		parentUrl: null,
		rootParentHash: "0x6f27d0ca797b1951f3084a5d64b3a98a541e5fcd",
		rootParentUrl:
			"chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
		embeddedUrls: null,
		embeddedCasts: null,
		mentions: null,
		mentionsPositions: null,
		tickerMentions: null,
		tickerMentionsPositions: null,
		channelMentions: null,
		channelMentionsPositions: null,
		embeddedCastsFids: null,
		embeds: null,
		creatorAppFid: 9152,
		deleterAppFid: null,
		round: null,
		likesCount: "2",
		recastsCount: "0",
		commentsCount: "0",
		creator: {
			id: "0190d03c-4ef4-b830-95e3-aef3773693fe",
			createdAt: new Date("2024-09-27T17:53:22.925Z"),
			updatedAt: new Date("2025-05-06T00:54:13.485Z"),
			deletedAt: null,
			fid: 11500,
			bio: "Head Gamemaker @esports / nouns.gg",
			pfpUrl:
				"https://supercast.mypinata.cloud/ipfs/QmVyxpCxueQ8BKEVgew9f9kN8wjP9CnFgdfECq1D6aJeJ2?filename=IMG_0458.png",
			url: null,
			username: "sams",
			displayName: "Sam",
			location: "geo:40.51,-88.99",
			latitude: 40.51,
			longitude: -88.99,
			primaryEthAddress: "0xc2fda88c8706e5f3ec92ec2d13889567a7e3d7bb",
			primarySolAddress:
				"0x9a7d7f1eec9d9c907b149ddbffe61062a38ade3ace95b6bd17c91e9a0102549a",
		},
		community: null,
	},
	{
		id: "0196b525-b6e3-6886-747e-ca8d939e151f",
		createdAt: new Date("2025-05-09T13:04:29.916Z"),
		updatedAt: new Date("2025-05-09T13:04:29.916Z"),
		deletedAt: null,
		timestamp: new Date("2025-05-09T13:04:29.000Z"),
		fid: 11500,
		hash: "0xb59466427c58a4555899139aedf68545bc4c405c",
		text: "Cast your votes here 👇 \nhttps://nouns.gg/rounds/game-jam",
		parentHash: "0x5db0d4016e8f071dd8c9d99d43ee264aecc2ac18",
		parentFid: 402730,
		parentUrl: null,
		rootParentHash: "0x5db0d4016e8f071dd8c9d99d43ee264aecc2ac18",
		rootParentUrl: "https://nouns.gg",
		embeddedUrls: ["https://nouns.gg/rounds/game-jam"],
		embeddedCasts: null,
		mentions: null,
		mentionsPositions: null,
		tickerMentions: null,
		tickerMentionsPositions: null,
		channelMentions: null,
		channelMentionsPositions: null,
		embeddedCastsFids: null,
		embeds: "[{'url': 'https://nouns.gg/rounds/game-jam'}]",
		creatorAppFid: 9152,
		deleterAppFid: null,
		round: {
			handle: "game-jam",
			name: "Nouns x Farcade Game Jam",
			image:
				"https://ipfs.nouns.gg/ipfs/bafkreiezldni7pe77te56fhtjem7tbnankmaqhtuytffvyywh6vftgub2y",
			type: "url",
			featured: true,
			content:
				'{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Nouns GG","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" and ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Farcade","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://farcade.ai/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" are teaming up to run a Nouns themed game jam!","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"What is Nouns?","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Nouns","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://www.youtube.com/watch?v=lOzCA7bZG_k"},{"detail":0,"format":0,"mode":"normal","style":"","text":" is a community-owned brand. All Nouns artwork is CC0-licensed, so it’s entirely open-source for anyone to use or remix. One Noun goes up for auction every day, fueling creative projects and supporting a brand that anyone can freely build on and join.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"How to enter?","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Create a Nouns themed game using ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Farcade\'s studio","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://app.farcade.ai"},{"detail":0,"format":0,"mode":"normal","style":"","text":" and share the link to play it in your proposal.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Prizing","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"We are distributing ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"$800","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" to the top 10 submissions that get voted on by the community. Additionally, the top 10 submissions will receive ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"10k Farcade Points","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" each.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Where can I find assets for my game?","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Below is a list of websites with assets you can freely use or remix in your games.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CC0-LIB","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://cc0-lib.wtf/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Voadz","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/voadz"},{"detail":0,"format":0,"mode":"normal","style":"","text":" and ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"NeroOne","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/n1"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (2D assets)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"3D Nouns","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://3dnouns.com/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CoralOrca","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/coralorca"},{"detail":0,"format":0,"mode":"normal","style":"","text":" and ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"0xFloyd","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/red"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (3D assets)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Nounish Traits","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://www.figma.com/community/file/1280649696072601487"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Index Card","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/indexcard.eth"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (Figma of all Nouns traits)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Noundry","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://gallery.noundry.wtf/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Volky","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/volky.eth"},{"detail":0,"format":0,"mode":"normal","style":"","text":" and ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CoralOrca","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/coralorca"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (Create custom Nouns traits)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Palettes","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://www.palettes.wtf/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Mike Good","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/mikegood"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (Color palettes)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"3D Buildings","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://nouns-assets-generator.vercel.app/"},{"detail":0,"format":0,"mode":"normal","style":"","text":" by ","type":"text","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"CoralOrca","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":"noreferrer","target":null,"title":null,"url":"https://warpcast.com/coralorca"},{"detail":0,"format":0,"mode":"normal","style":"","text":" (3D assets)","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":6}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"How do I use these assets in my game?","type":"text","version":1}],"direction":"ltr","format":"start","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Upload your selected asset(s) on the assets tab, then provide ChatGPT with the name of the file and how you want to use it in your game.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}',
			start: "2025-04-15T06:00:00",
			voting_start: "2025-05-09T06:00:00",
			end: "2025-05-16T19:00:00",
			description: null,
			id: 53,
			community: 8,
			event: null,
			draft: false,
			min_title_length: 15,
			max_title_length: 100,
			min_description_length: 0,
			max_description_length: 2000,
			link_regex: null,
			max_proposals: 3,
		},
		likesCount: "1",
		recastsCount: "0",
		commentsCount: "0",
		creator: {
			id: "0190d03c-4ef4-b830-95e3-aef3773693fe",
			createdAt: new Date("2024-09-27T17:53:22.925Z"),
			updatedAt: new Date("2025-05-06T00:54:13.485Z"),
			deletedAt: null,
			fid: 11500,
			bio: "Head Gamemaker @esports / nouns.gg",
			pfpUrl:
				"https://supercast.mypinata.cloud/ipfs/QmVyxpCxueQ8BKEVgew9f9kN8wjP9CnFgdfECq1D6aJeJ2?filename=IMG_0458.png",
			url: null,
			username: "sams",
			displayName: "Sam",
			location: "geo:40.51,-88.99",
			latitude: 40.51,
			longitude: -88.99,
			primaryEthAddress: "0xc2fda88c8706e5f3ec92ec2d13889567a7e3d7bb",
			primarySolAddress:
				"0x9a7d7f1eec9d9c907b149ddbffe61062a38ade3ace95b6bd17c91e9a0102549a",
		},
		community: {
			id: 7,
			handle: "nouns-gg",
			image: "https://i.imgur.com/ZeGD2QF.jpg",
			name: "Nouns GG",
			description: null,
			parentUrl: "https://nouns.gg",
			gold: 13500,
		},
	},
	{
		id: "0196b524-d7a5-7eac-0d99-80a875d6ec23",
		createdAt: new Date("2025-05-09T13:03:32.763Z"),
		updatedAt: new Date("2025-05-09T13:03:32.763Z"),
		deletedAt: null,
		timestamp: new Date("2025-05-09T13:03:30.000Z"),
		fid: 11500,
		hash: "0x6f27d0ca797b1951f3084a5d64b3a98a541e5fcd",
		text: "Huge thanks to everyone who participated in the Lets Play Nouns #4 round ⌐◨-◨\n\nCongrats to    for winning the Noun delegations!\nhttps://nouns.gg/rounds/lets-play-nouns-4",
		parentHash: null,
		parentFid: null,
		parentUrl:
			"chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
		rootParentHash: "0x6f27d0ca797b1951f3084a5d64b3a98a541e5fcd",
		rootParentUrl:
			"chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
		embeddedUrls: ["https://nouns.gg/rounds/lets-play-nouns-4"],
		embeddedCasts: null,
		mentions: [1020190, 940529, 911234],
		mentionsPositions: [97, 98, 99],
		tickerMentions: null,
		tickerMentionsPositions: null,
		channelMentions: null,
		channelMentionsPositions: null,
		embeddedCastsFids: null,
		embeds: "[{'url': 'https://nouns.gg/rounds/lets-play-nouns-4'}]",
		creatorAppFid: 9152,
		deleterAppFid: null,
		round: {
			handle: "lets-play-nouns-4",
			name: "Let's Play Nouns - Round 4",
			image:
				"https://ipfs.nouns.gg/ipfs/QmSGYg5t25SQDp1xBw5tqDrfsF62T2HHVZpH4VduaAwJkT",
			type: "markdown",
			featured: true,
			content:
				'{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"🎮 Let’s Play Nouns – Round 4","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h1"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Proposal Period:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" April 18 – April 25","type":"text","version":1},{"type":"linebreak","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"Voting Period:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" April 25 – May 2","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"The ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"Let’s Play Nouns Delegate Program","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" is back for Round 4! This initiative is all about expanding awareness and participation in the Nouns ecosystem. It gives passionate individuals a chance to actively shape the future of NounsDAO—no Noun ownership required.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"We’re on the lookout for ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"three new delegates","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" who are excited to contribute to the DAO and represent the broader community in governance.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"❗️","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"Note:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" If you\'ve been selected as a delegate in a previous Let\'s Play Nouns round, you\'re ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"not eligible","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" to apply for Round 4. We\'re committed to opening the door for ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"new voices","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" and providing fresh faces a seat at the table.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"quote","version":1},{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"link","version":1,"rel":null,"target":null,"title":"👤-Delegate-Responsibilities","url":"#👤-Delegate-Responsibilities"},{"detail":0,"format":0,"mode":"normal","style":"","text":"👤 Delegate Responsibilities","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Vote on ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"at least 66%","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" of NounsDAO proposals during your term","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Share thoughtful ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"vote reasoning","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" or reference other voters\' points of view","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Post ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"biweekly updates","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" in the ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"/nouns","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" channel on ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"Warpcast","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":", reflecting on your experience","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"link","version":1,"rel":null,"target":null,"title":"✍️-How-to-Apply","url":"#✍️-How-to-Apply"},{"detail":0,"format":0,"mode":"normal","style":"","text":"✍️ How to Apply","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Submit a proposal that highlights:","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Your understanding of Nouns and its culture","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"How you plan to serve and represent the community","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Your vision for bringing meaningful impact as a delegate","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Whether you\'re crypto-native or just getting started, if you\'re passionate about open governance and creative community-building—","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"we want to hear from you","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":".","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Let’s play Nouns—","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"and let’s do it together","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":".","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}',
			start: "2025-04-25T05:00:00",
			voting_start: "2025-05-02T05:00:00",
			end: "2025-05-09T05:00:00",
			description: null,
			id: 58,
			community: 8,
			event: null,
			draft: false,
			min_title_length: 15,
			max_title_length: 100,
			min_description_length: 0,
			max_description_length: 2000,
			link_regex: null,
			max_proposals: 1,
		},
		likesCount: "12",
		recastsCount: "0",
		commentsCount: "0",
		creator: {
			id: "0190d03c-4ef4-b830-95e3-aef3773693fe",
			createdAt: new Date("2024-09-27T17:53:22.925Z"),
			updatedAt: new Date("2025-05-06T00:54:13.485Z"),
			deletedAt: null,
			fid: 11500,
			bio: "Head Gamemaker @esports / nouns.gg",
			pfpUrl:
				"https://supercast.mypinata.cloud/ipfs/QmVyxpCxueQ8BKEVgew9f9kN8wjP9CnFgdfECq1D6aJeJ2?filename=IMG_0458.png",
			url: null,
			username: "sams",
			displayName: "Sam",
			location: "geo:40.51,-88.99",
			latitude: 40.51,
			longitude: -88.99,
			primaryEthAddress: "0xc2fda88c8706e5f3ec92ec2d13889567a7e3d7bb",
			primarySolAddress:
				"0x9a7d7f1eec9d9c907b149ddbffe61062a38ade3ace95b6bd17c91e9a0102549a",
		},
		community: null,
	},
	{
		id: "0196b311-9453-cb0e-0232-69c96ec61516",
		createdAt: new Date("2025-05-09T03:23:15.909Z"),
		updatedAt: new Date("2025-05-09T03:23:15.909Z"),
		deletedAt: null,
		timestamp: new Date("2025-05-09T03:23:14.000Z"),
		fid: 11500,
		hash: "0xcb017bba9ba9ececb50a778c69f15e4a686e3df0",
		text: "Good idea 👍",
		parentHash: "0xe991d7bbb96ecc4de31d0bca8f0592bd805d68bd",
		parentFid: 2112,
		parentUrl: null,
		rootParentHash: "0x2edff7410d0a5e4417c4c2eaa03e4cccf192bb98",
		rootParentUrl:
			"chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
		embeddedUrls: null,
		embeddedCasts: null,
		mentions: null,
		mentionsPositions: null,
		tickerMentions: null,
		tickerMentionsPositions: null,
		channelMentions: null,
		channelMentionsPositions: null,
		embeddedCastsFids: null,
		embeds: null,
		creatorAppFid: 9152,
		deleterAppFid: null,
		round: null,
		likesCount: "1",
		recastsCount: "0",
		commentsCount: "0",
		creator: {
			id: "0190d03c-4ef4-b830-95e3-aef3773693fe",
			createdAt: new Date("2024-09-27T17:53:22.925Z"),
			updatedAt: new Date("2025-05-06T00:54:13.485Z"),
			deletedAt: null,
			fid: 11500,
			bio: "Head Gamemaker @esports / nouns.gg",
			pfpUrl:
				"https://supercast.mypinata.cloud/ipfs/QmVyxpCxueQ8BKEVgew9f9kN8wjP9CnFgdfECq1D6aJeJ2?filename=IMG_0458.png",
			url: null,
			username: "sams",
			displayName: "Sam",
			location: "geo:40.51,-88.99",
			latitude: 40.51,
			longitude: -88.99,
			primaryEthAddress: "0xc2fda88c8706e5f3ec92ec2d13889567a7e3d7bb",
			primarySolAddress:
				"0x9a7d7f1eec9d9c907b149ddbffe61062a38ade3ace95b6bd17c91e9a0102549a",
		},
		community: null,
	},
	{
		id: "0196b04a-1a16-16d3-6b32-63f49c7b98d1",
		createdAt: new Date("2025-05-08T14:26:08.527Z"),
		updatedAt: new Date("2025-05-08T14:26:08.527Z"),
		deletedAt: null,
		timestamp: new Date("2025-05-08T14:26:07.000Z"),
		fid: 11500,
		hash: "0xd0db4d6773fa920ec3667f4ca0aeff2f0d48d41d",
		text: "I bet 500 Gold that a Noun will sell for more than 3 ETH in the month of May ⌐◨-◨\nhttps://nouns.gg/predictions/noun-greater-3-eth",
		parentHash: null,
		parentFid: null,
		parentUrl:
			"chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
		rootParentHash: "0xd0db4d6773fa920ec3667f4ca0aeff2f0d48d41d",
		rootParentUrl:
			"chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
		embeddedUrls: ["https://nouns.gg/predictions/noun-greater-3-eth"],
		embeddedCasts: null,
		mentions: null,
		mentionsPositions: null,
		tickerMentions: null,
		tickerMentionsPositions: null,
		channelMentions: null,
		channelMentionsPositions: null,
		embeddedCastsFids: null,
		embeds: "[{'url': 'https://nouns.gg/predictions/noun-greater-3-eth'}]",
		creatorAppFid: 9152,
		deleterAppFid: null,
		round: null,
		likesCount: "11",
		recastsCount: "0",
		commentsCount: "0",
		creator: {
			id: "0190d03c-4ef4-b830-95e3-aef3773693fe",
			createdAt: new Date("2024-09-27T17:53:22.925Z"),
			updatedAt: new Date("2025-05-06T00:54:13.485Z"),
			deletedAt: null,
			fid: 11500,
			bio: "Head Gamemaker @esports / nouns.gg",
			pfpUrl:
				"https://supercast.mypinata.cloud/ipfs/QmVyxpCxueQ8BKEVgew9f9kN8wjP9CnFgdfECq1D6aJeJ2?filename=IMG_0458.png",
			url: null,
			username: "sams",
			displayName: "Sam",
			location: "geo:40.51,-88.99",
			latitude: 40.51,
			longitude: -88.99,
			primaryEthAddress: "0xc2fda88c8706e5f3ec92ec2d13889567a7e3d7bb",
			primarySolAddress:
				"0x9a7d7f1eec9d9c907b149ddbffe61062a38ade3ace95b6bd17c91e9a0102549a",
		},
		community: null,
	},
];

export default async function Home() {
	const [
		user,
		// posts,
		rounds,
		communities,
		quests,
	] = await Promise.all([
		getAuthenticatedUser(),
		// getPosts(),
		getRounds({ limit: 4 }),
		getCommunities({ featured: true, limit: 4 }),
		getQuests({ limit: 4 }),
	]);
	// const predictions = await getPredictions({ limit: 5 });
	// const events = await getEvents({ limit: 5 });

	return (
		<div className="flex flex-col w-full items-center">
			<div className="flex w-full gap-16 mb-16 max-sm:mb-8 max-lg:gap-12 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 max-w-[1920px]">
				<div className="flex flex-col items-center w-full">
					<Feed
						user={user}
						posts={posts as any}
						// rounds={rounds}
						// quests={quests}
						// predictions={predictions}
						// events={events}
					/>
				</div>
				<aside className="flex flex-col gap-4 w-[400px] flex-shrink-0 max-lg:hidden">
					<Gallery />
					<div className="flex flex-col gap-4 bg-grey-800 py-3 px-4 rounded-xl">
						<div className="flex justify-between">
							<h2 className="text-white text-2xl font-bebas-neue">
								Trending Communities
							</h2>
							<Link
								href="/communities"
								className="text-red group hover:text-red/70 transition-colors flex items-center gap-1"
							>
								View All
								<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
							</Link>
						</div>
						<ul className="flex flex-col gap-3">
							{communities.map((community) => (
								<Link href={`/c/${community.handle}`} key={community.id}>
									<li className="flex items-center gap-2 text-white hover:text-white/70 transition-colors">
										<img
											src={community.image}
											alt={community.name}
											className="w-6 h-6 rounded-md"
										/>
										{community.name}
									</li>
								</Link>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-4 bg-grey-800 py-3 px-4 rounded-xl">
						<div className="flex justify-between">
							<h2 className="text-white text-2xl font-bebas-neue">
								Latest Rounds
							</h2>
							<Link
								href="/rounds"
								className="text-red group hover:text-red/70 transition-colors flex items-center gap-1"
							>
								View All
								<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
							</Link>
						</div>
						<ul className="flex flex-col gap-3">
							{rounds.map((round) => (
								<Link href={`/rounds/${round.handle}`} key={round.id}>
									<li className="flex items-center gap-2 text-white hover:text-white/70 transition-colors">
										<img
											src={round.image}
											alt={round.name}
											className="w-6 h-6 rounded-md"
										/>
										{round.name}
									</li>
								</Link>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-4 bg-grey-800 py-3 px-4 rounded-xl">
						<div className="flex justify-between">
							<h2 className="text-white text-2xl font-bebas-neue">
								Featured Quests
							</h2>
							<Link
								href="/quests"
								className="text-red group hover:text-red/70 transition-colors flex items-center gap-1"
							>
								View All
								<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
							</Link>
						</div>
						<ul className="flex flex-col gap-3">
							{quests.map((quest) => (
								<Link href={`/quests/${quest.handle}`} key={quest.id}>
									<li className="flex items-center gap-2 text-white hover:text-white/70 transition-colors">
										<img
											src={quest.image}
											alt={quest.name}
											className="w-6 h-6 rounded-md"
										/>
										{quest.name}
									</li>
								</Link>
							))}
						</ul>
					</div>
					<div className="flex gap-4 items-center text-sm px-4 text-grey-400">
						<Link href="/discord">Support</Link>
						<Link href="/discord">Discord</Link>
					</div>
				</aside>
			</div>
		</div>
	);
}
