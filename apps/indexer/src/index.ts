import { ponder } from "ponder:registry";
import {
	lilnounDelegates,
	nounDelegates,
	erc721Balances,
	nounsProposals,
	nounsAuctions,
} from "../ponder.schema";
import { markdownToTipTap } from "~/packages/utils/markdownToTipTap";
import { estimateTimestamp } from "~/packages/utils/estimateTimestamp";
import { generateSVGPart } from "~/packages/utils/generateSVGParts";
import { isValidURL } from "~/packages/utils/isValidURL";
import { unpadSVG } from "~/packages/utils/unpadSVG";
import { parseVoteReason } from "~/packages/utils/parseVoteReason";
import {
	// ensProfiles,
	nouns,
	nounsBids,
	nounsClients,
	nounsTraits,
	nounsVotes,
	voteReposts,
} from "ponder:schema";
// import { normalize } from "viem/ens";
import { env } from "~/env";
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
	pinataJwt: env.PINATA_JWT,
	pinataGateway: "ipfs.nouns.gg",
});

ponder.on("NounsToken:Transfer", async ({ event, context }) => {
	// const toEnsName = await context.client.getEnsName({
	// 	address: event.args.to,
	// 	blockNumber: 19258213n,
	// });

	// if (toEnsName) {
	// 	const toEnsAvatar = await context.client.getEnsAvatar({
	// 		name: normalize(toEnsName),
	// 	});

	// 	await context.db
	// 		.insert(ensProfiles)
	// 		.values({
	// 			address: event.args.to,
	// 			name: toEnsName,
	// 			image: toEnsAvatar,
	// 		})
	// 		.onConflictDoUpdate({
	// 			image: toEnsAvatar,
	// 			name: toEnsName,
	// 		});
	// }

	// const fromEnsName = await context.client.getEnsName({
	// 	address: event.args.from,
	// });

	// if (fromEnsName) {
	// 	const fromEnsAvatar = await context.client.getEnsAvatar({
	// 		name: normalize(fromEnsName),
	// 	});

	// 	await context.db
	// 		.insert(ensProfiles)
	// 		.values({
	// 			address: event.args.from,
	// 			name: fromEnsName,
	// 			image: fromEnsAvatar,
	// 		})
	// 		.onConflictDoUpdate({
	// 			image: fromEnsAvatar,
	// 			name: fromEnsName,
	// 		});
	// }

	await context.db
		.insert(erc721Balances)
		.values({
			account: event.args.to,
			collection: context.contracts.NounsToken.address,
			tokenId: event.args.tokenId,
		})
		.onConflictDoUpdate({
			account: event.args.to,
		});
});

ponder.on("LilNounsToken:Transfer", async ({ event, context }) => {
	// const toEnsName = await context.client.getEnsName({
	// 	address: event.args.to,
	// });

	// if (toEnsName) {
	// 	const toEnsAvatar = await context.client.getEnsAvatar({
	// 		name: normalize(toEnsName),
	// 	});

	// 	await context.db
	// 		.insert(ensProfiles)
	// 		.values({
	// 			address: event.args.to,
	// 			name: toEnsName,
	// 			image: toEnsAvatar,
	// 		})
	// 		.onConflictDoUpdate({
	// 			image: toEnsAvatar,
	// 			name: toEnsName,
	// 		});
	// }

	// const fromEnsName = await context.client.getEnsName({
	// 	address: event.args.from,
	// });

	// if (fromEnsName) {
	// 	const fromEnsAvatar = await context.client.getEnsAvatar({
	// 		name: normalize(fromEnsName),
	// 	});

	// 	await context.db
	// 		.insert(ensProfiles)
	// 		.values({
	// 			address: event.args.from,
	// 			name: fromEnsName,
	// 			image: fromEnsAvatar,
	// 		})
	// 		.onConflictDoUpdate({
	// 			image: fromEnsAvatar,
	// 			name: fromEnsName,
	// 		});
	// }

	await context.db
		.insert(erc721Balances)
		.values({
			account: event.args.to,
			collection: context.contracts.LilNounsToken.address,
			tokenId: event.args.tokenId,
		})
		.onConflictDoUpdate({
			account: event.args.to,
		});
});

ponder.on("NounsToken:DelegateChanged", async ({ event, context }) => {
	// const toDelegateEnsName = await context.client.getEnsName({
	// 	address: event.args.toDelegate,
	// });

	// if (toDelegateEnsName) {
	// 	const toDelegateEnsAvatar = await context.client.getEnsAvatar({
	// 		name: normalize(toDelegateEnsName),
	// 	});

	// 	await context.db
	// 		.insert(ensProfiles)
	// 		.values({
	// 			address: event.args.toDelegate,
	// 			name: toDelegateEnsName,
	// 			image: toDelegateEnsAvatar,
	// 		})
	// 		.onConflictDoUpdate({
	// 			image: toDelegateEnsAvatar,
	// 			name: toDelegateEnsName,
	// 		});
	// }

	// const fromDelegateEnsName = await context.client.getEnsName({
	// 	address: event.args.fromDelegate,
	// });

	// if (fromDelegateEnsName) {
	// 	const fromDelegateEnsAvatar = await context.client.getEnsAvatar({
	// 		name: normalize(fromDelegateEnsName),
	// 	});

	// 	await context.db
	// 		.insert(ensProfiles)
	// 		.values({
	// 			address: event.args.fromDelegate,
	// 			name: fromDelegateEnsName,
	// 			image: fromDelegateEnsAvatar,
	// 		})
	// 		.onConflictDoUpdate({
	// 			image: fromDelegateEnsAvatar,
	// 			name: fromDelegateEnsName,
	// 		});
	// }

	await context.db
		.insert(nounDelegates)
		.values({
			from: event.args.fromDelegate,
			to: event.args.toDelegate,
			votes: 0n,
		})
		.onConflictDoUpdate({
			to: event.args.toDelegate,
		});
});

ponder.on("LilNounsToken:DelegateChanged", async ({ event, context }) => {
	// const toDelegateEnsName = await context.client.getEnsName({
	// 	address: event.args.toDelegate,
	// });

	// if (toDelegateEnsName) {
	// 	const toDelegateEnsAvatar = await context.client.getEnsAvatar({
	// 		name: normalize(toDelegateEnsName),
	// 	});

	// 	await context.db
	// 		.insert(ensProfiles)
	// 		.values({
	// 			address: event.args.toDelegate,
	// 			name: toDelegateEnsName,
	// 			image: toDelegateEnsAvatar,
	// 		})
	// 		.onConflictDoUpdate({
	// 			image: toDelegateEnsAvatar,
	// 			name: toDelegateEnsName,
	// 		});
	// }

	// const fromDelegateEnsName = await context.client.getEnsName({
	// 	address: event.args.fromDelegate,
	// });

	// if (fromDelegateEnsName) {
	// 	const fromDelegateEnsAvatar = await context.client.getEnsAvatar({
	// 		name: normalize(fromDelegateEnsName),
	// 	});

	// 	await context.db
	// 		.insert(ensProfiles)
	// 		.values({
	// 			address: event.args.fromDelegate,
	// 			name: fromDelegateEnsName,
	// 			image: fromDelegateEnsAvatar,
	// 		})
	// 		.onConflictDoUpdate({
	// 			image: fromDelegateEnsAvatar,
	// 			name: fromDelegateEnsName,
	// 		});
	// }

	await context.db
		.insert(lilnounDelegates)
		.values({
			from: event.args.fromDelegate,
			to: event.args.toDelegate,
			votes: 0n,
		})
		.onConflictDoUpdate({
			to: event.args.toDelegate,
		});
});

ponder.on("NounsDAOGovernor:ProposalCreated", async ({ event, context }) => {
	const description = await markdownToTipTap({
		markdown: event.args.description,
		onImage: async (src) => {
			try {
				const upload = await pinata.upload.public.url(src);

				return `https://ipfs.nouns.gg/ipfs/${upload.cid}`;
			} catch {}

			return src;
		},
	});

	const startTime = estimateTimestamp({
		blocks: Number(event.args.startBlock) - Number(event.block.number),
	});

	const endTime = estimateTimestamp({
		blocks: Number(event.args.endBlock) - Number(event.block.number),
	});

	// const ensName = await context.client.getEnsName({
	// 	address: event.args.proposer,
	// });

	// if (ensName) {
	// 	const ensAvatar = await context.client.getEnsAvatar({
	// 		name: normalize(ensName),
	// 	});

	// 	await context.db
	// 		.insert(ensProfiles)
	// 		.values({
	// 			address: event.args.proposer,
	// 			name: ensName,
	// 			image: ensAvatar,
	// 		})
	// 		.onConflictDoUpdate({
	// 			image: ensAvatar,
	// 			name: ensName,
	// 		});
	// }

	await context.db.insert(nounsProposals).values({
		id: event.args.id,
		proposer: event.args.proposer,
		targets: [...event.args.targets],
		values: [...event.args.values],
		signatures: [...event.args.signatures],
		calldatas: [...event.args.calldatas],
		description,
		startTime,
		endTime,
		canceled: false,
		vetoed: false,
		createdAt: new Date(Number(event.block.timestamp) * 1000),
		quorum: {
			min: 0,
			current: 0,
			max: 0,
		},
	});
});

ponder.on(
	"NounsDAOGovernor:ProposalCreatedWithRequirements(uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, uint256 proposalThreshold, uint256 quorumVotes, string description)",
	async ({ event, context }) => {
		let minQuorumVotes = 0n;
		let maxQuorumVotes = 0n;

		if (event.block.number > 15773219n) {
			minQuorumVotes = await context.client.readContract({
				address: context.contracts.NounsDAOGovernor.address,
				abi: context.contracts.NounsDAOGovernor.abi,
				functionName: "minQuorumVotes",
			});

			maxQuorumVotes = await context.client.readContract({
				address: context.contracts.NounsDAOGovernor.address,
				abi: context.contracts.NounsDAOGovernor.abi,
				functionName: "maxQuorumVotes",
			});
		}

		await context.db.update(nounsProposals, { id: event.args.id }).set({
			quorum: {
				min:
					minQuorumVotes === 0n
						? Number(event.args.quorumVotes)
						: Number(minQuorumVotes),
				current: Number(event.args.quorumVotes),
				max:
					maxQuorumVotes === 0n
						? Number(event.args.quorumVotes)
						: Number(maxQuorumVotes),
			},
		});
	},
);

ponder.on(
	"NounsDAOGovernor:ProposalCreatedWithRequirements(uint256 id, address[] signers, uint256 updatePeriodEndBlock, uint256 proposalThreshold, uint256 quorumVotes, uint32 indexed clientId)",
	async ({ event, context }) => {
		const minQuorumVotes = await context.client.readContract({
			address: context.contracts.NounsDAOGovernor.address,
			abi: context.contracts.NounsDAOGovernor.abi,
			functionName: "minQuorumVotes",
		});

		const maxQuorumVotes = await context.client.readContract({
			address: context.contracts.NounsDAOGovernor.address,
			abi: context.contracts.NounsDAOGovernor.abi,
			functionName: "maxQuorumVotes",
		});

		await context.db.update(nounsProposals, { id: event.args.id }).set({
			client: event.args.clientId,
			quorum: {
				min: Number(minQuorumVotes),
				current: Number(event.args.quorumVotes),
				max: Number(maxQuorumVotes),
			},
		});
	},
);

ponder.on("NounsDAOGovernor:ProposalUpdated", async ({ event, context }) => {
	const description = await markdownToTipTap({
		markdown: event.args.description,
		onImage: async (src) => {
			try {
				const upload = await pinata.upload.public.url(src);

				return `https://ipfs.nouns.gg/ipfs/${upload.cid}`;
			} catch {}

			return src;
		},
	});

	const proposal = await context.client.readContract({
		address: context.contracts.NounsDAOGovernor.address,
		abi: context.contracts.NounsDAOGovernor.abi,
		functionName: "proposals",
		args: [event.args.id],
	});

	const startTime = estimateTimestamp({
		blocks: Number(proposal.startBlock) - Number(event.block.number),
	});

	const endTime = estimateTimestamp({
		blocks: Number(proposal.endBlock) - Number(event.block.number),
	});

	await context.db.update(nounsProposals, { id: event.args.id }).set({
		description,
		targets: [...event.args.targets],
		values: [...event.args.values],
		signatures: [...event.args.signatures],
		calldatas: [...event.args.calldatas],
		startTime,
		endTime,
	});
});

ponder.on("NounsDAOGovernor:VoteCast", async ({ event, context }) => {
	if (event.args.support === 0) {
		const quorumVotes = await context.client.readContract({
			address: context.contracts.NounsDAOGovernor.address,
			abi: context.contracts.NounsDAOGovernor.abi,
			functionName: "quorumVotes",
			args: [event.args.proposalId],
		});

		let minQuorumVotes = 0n;
		let maxQuorumVotes = 0n;

		if (event.block.number > 15773219) {
			minQuorumVotes = await context.client.readContract({
				address: context.contracts.NounsDAOGovernor.address,
				abi: context.contracts.NounsDAOGovernor.abi,
				functionName: "minQuorumVotes",
			});

			maxQuorumVotes = await context.client.readContract({
				address: context.contracts.NounsDAOGovernor.address,
				abi: context.contracts.NounsDAOGovernor.abi,
				functionName: "maxQuorumVotes",
			});
		}

		await context.db.update(nounsProposals, { id: event.args.proposalId }).set({
			quorum: {
				min:
					minQuorumVotes === 0n ? Number(quorumVotes) : Number(minQuorumVotes),
				current: Number(quorumVotes),
				max:
					maxQuorumVotes === 0n ? Number(quorumVotes) : Number(maxQuorumVotes),
			},
		});
	}

	// const ensName = await context.client.getEnsName({
	// 	address: event.args.voter,
	// });

	// if (ensName) {
	// 	const ensAvatar = await context.client.getEnsAvatar({
	// 		name: normalize(ensName),
	// 	});

	// 	await context.db
	// 		.insert(ensProfiles)
	// 		.values({
	// 			address: event.args.voter,
	// 			name: ensName,
	// 			image: ensAvatar,
	// 		})
	// 		.onConflictDoUpdate({
	// 			image: ensAvatar,
	// 			name: ensName,
	// 		});
	// }

	const reason = parseVoteReason(event.args.reason);

	for (const repost of reason.reposts) {
		const repostedVote = await context.db.sql.query.nounsVotes.findFirst({
			where: (t, { eq }) => eq(t.reason, repost.text),
		});

		if (repostedVote) {
			await context.db.insert(voteReposts).values({
				proposal: event.args.proposalId,
				reposter: event.args.voter,
				voter: repostedVote.voter,
			});
		}
	}

	await context.db.insert(nounsVotes).values({
		proposal: event.args.proposalId,
		voter: event.args.voter,
		support: event.args.support,
		amount: event.args.votes,
		timestamp: new Date(Number(event.block.timestamp) * 1000),
		reason: reason.text.length > 0 ? reason.text : null,
	});

	const proposal = await context.client.readContract({
		address: context.contracts.NounsDAOGovernor.address,
		abi: context.contracts.NounsDAOGovernor.abi,
		functionName: "proposals",
		args: [event.args.proposalId],
	});

	const startTime = estimateTimestamp({
		blocks: Number(proposal.startBlock) - Number(event.block.number),
	});

	const endTime = estimateTimestamp({
		blocks: Number(proposal.endBlock) - Number(event.block.number),
	});

	await context.db.update(nounsProposals, { id: event.args.proposalId }).set({
		startTime,
		endTime,
	});
});

ponder.on(
	"NounsDAOGovernor:VoteCastWithClientId",
	async ({ event, context }) => {
		await context.db
			.update(nounsVotes, {
				proposal: event.args.proposalId,
				voter: event.args.voter,
			})
			.set({
				client: event.args.clientId,
			});
	},
);

ponder.on("NounsDAOGovernor:ProposalCanceled", async ({ event, context }) => {
	await context.db.update(nounsProposals, { id: event.args.id }).set({
		canceled: true,
	});
});

ponder.on("NounsDAOGovernor:ProposalVetoed", async ({ event, context }) => {
	await context.db.update(nounsProposals, { id: event.args.id }).set({
		vetoed: true,
	});
});

ponder.on("NounsDAOGovernor:ProposalQueued", async ({ event, context }) => {
	const proposal = await context.client.readContract({
		address: context.contracts.NounsDAOGovernor.address,
		abi: context.contracts.NounsDAOGovernor.abi,
		functionName: "proposals",
		args: [event.args.id],
	});

	const startTime = estimateTimestamp({
		blocks: Number(proposal.startBlock) - Number(event.block.number),
	});

	const endTime = estimateTimestamp({
		blocks: Number(proposal.endBlock) - Number(event.block.number),
	});

	await context.db.update(nounsProposals, { id: event.args.id }).set({
		startTime,
		endTime,
	});
});

ponder.on("NounsRewards:ClientRegistered", async ({ event, context }) => {
	const validURL = isValidURL(event.args.description);

	await context.db.insert(nounsClients).values({
		id: event.args.clientId,
		name: event.args.name,
		url: validURL ? event.args.description : null,
	});
});

ponder.on("NounsRewards:ClientUpdated", async ({ event, context }) => {
	const validURL = isValidURL(event.args.description);

	await context.db.update(nounsClients, { id: event.args.clientId }).set({
		name: event.args.name,
		url: validURL ? event.args.description : null,
	});
});

ponder.on("NounsToken:NounCreated", async ({ event, context }) => {
	await context.db.insert(nouns).values({
		id: event.args.tokenId,
		background: event.args.seed.background === 0 ? "#d5d7e1" : "#e1d7d5",
		body: `body:${event.args.seed.body}`,
		accessory: `accessory:${event.args.seed.accessory}`,
		head: `head:${event.args.seed.head}`,
		glasses: `glasses:${event.args.seed.glasses}`,
	});
});

ponder.on("NounsArt:BodiesAdded", async ({ event, context }) => {
	const bodyCount = Number(
		await context.client.readContract({
			address: context.contracts.NounsArt.address,
			abi: context.contracts.NounsArt.abi,
			functionName: "bodyCount",
		}),
	);

	for (let i = bodyCount - event.args.count; i < bodyCount; i++) {
		const body = generateSVGPart({
			image: await context.client.readContract({
				address: context.contracts.NounsArt.address,
				abi: context.contracts.NounsArt.abi,
				functionName: "bodies",
				args: [BigInt(i)],
			}),
		});

		const unpaddedSVG = await unpadSVG(
			`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none">${body}</svg>`,
		);

		await context.db
			.insert(nounsTraits)
			.values({
				id: `body:${i}`,
				type: "body",
				index: i,
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			})
			.onConflictDoUpdate({
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			});
	}
});

ponder.on("NounsArt:AccessoriesAdded", async ({ event, context }) => {
	const accessoryCount = Number(
		await context.client.readContract({
			address: context.contracts.NounsArt.address,
			abi: context.contracts.NounsArt.abi,
			functionName: "accessoryCount",
		}),
	);

	for (let i = accessoryCount - event.args.count; i < accessoryCount; i++) {
		const accessory = generateSVGPart({
			image: await context.client.readContract({
				address: context.contracts.NounsArt.address,
				abi: context.contracts.NounsArt.abi,
				functionName: "accessories",
				args: [BigInt(i)],
			}),
		});

		const unpaddedSVG = await unpadSVG(
			`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none">${accessory}</svg>`,
		);

		await context.db
			.insert(nounsTraits)
			.values({
				id: `accessory:${i}`,
				type: "accessory",
				index: i,
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			})
			.onConflictDoUpdate({
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			});
	}
});

ponder.on("NounsArt:HeadsAdded", async ({ event, context }) => {
	const headCount = Number(
		await context.client.readContract({
			address: context.contracts.NounsArt.address,
			abi: context.contracts.NounsArt.abi,
			functionName: "headCount",
		}),
	);

	for (let i = headCount - event.args.count; i < headCount; i++) {
		const head = generateSVGPart({
			image: await context.client.readContract({
				address: context.contracts.NounsArt.address,
				abi: context.contracts.NounsArt.abi,
				functionName: "heads",
				args: [BigInt(i)],
			}),
		});

		const unpaddedSVG = await unpadSVG(
			`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none">${head}</svg>`,
		);

		await context.db
			.insert(nounsTraits)
			.values({
				id: `head:${i}`,
				type: "head",
				index: i,
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			})
			.onConflictDoUpdate({
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			});
	}
});

ponder.on("NounsArt:GlassesAdded", async ({ event, context }) => {
	const glassesCount = Number(
		await context.client.readContract({
			address: context.contracts.NounsArt.address,
			abi: context.contracts.NounsArt.abi,
			functionName: "glassesCount",
		}),
	);

	for (let i = glassesCount - event.args.count; i < glassesCount; i++) {
		const glasses = generateSVGPart({
			image: await context.client.readContract({
				address: context.contracts.NounsArt.address,
				abi: context.contracts.NounsArt.abi,
				functionName: "glasses",
				args: [BigInt(i)],
			}),
		});

		const unpaddedSVG = await unpadSVG(
			`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none">${glasses}</svg>`,
		);

		await context.db
			.insert(nounsTraits)
			.values({
				id: `glasses:${i}`,
				type: "glasses",
				index: i,
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			})
			.onConflictDoUpdate({
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			});
	}
});

ponder.on("NounsArt:BodiesUpdated", async ({ event, context }) => {
	const bodyCount = Number(
		await context.client.readContract({
			address: context.contracts.NounsArt.address,
			abi: context.contracts.NounsArt.abi,
			functionName: "bodyCount",
		}),
	);

	for (let i = 0; i < bodyCount; i++) {
		const body = generateSVGPart({
			image: await context.client.readContract({
				address: context.contracts.NounsArt.address,
				abi: context.contracts.NounsArt.abi,
				functionName: "bodies",
				args: [BigInt(i)],
			}),
		});

		const unpaddedSVG = await unpadSVG(
			`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none">${body}</svg>`,
		);

		await context.db
			.insert(nounsTraits)
			.values({
				id: `body:${i}`,
				type: "body",
				index: i,
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			})
			.onConflictDoUpdate({
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			});
	}
});

ponder.on("NounsArt:AccessoriesUpdated", async ({ event, context }) => {
	const accessoryCount = Number(
		await context.client.readContract({
			address: context.contracts.NounsArt.address,
			abi: context.contracts.NounsArt.abi,
			functionName: "accessoryCount",
		}),
	);

	for (let i = 0; i < accessoryCount; i++) {
		const accessory = generateSVGPart({
			image: await context.client.readContract({
				address: context.contracts.NounsArt.address,
				abi: context.contracts.NounsArt.abi,
				functionName: "accessories",
				args: [BigInt(i)],
			}),
		});

		const unpaddedSVG = await unpadSVG(
			`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none">${accessory}</svg>`,
		);

		await context.db
			.insert(nounsTraits)
			.values({
				id: `accessory:${i}`,
				type: "accessory",
				index: i,
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			})
			.onConflictDoUpdate({
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			});
	}
});

ponder.on("NounsArt:HeadsUpdated", async ({ event, context }) => {
	const headCount = Number(
		await context.client.readContract({
			address: context.contracts.NounsArt.address,
			abi: context.contracts.NounsArt.abi,
			functionName: "headCount",
		}),
	);

	for (let i = 0; i < headCount; i++) {
		const head = generateSVGPart({
			image: await context.client.readContract({
				address: context.contracts.NounsArt.address,
				abi: context.contracts.NounsArt.abi,
				functionName: "heads",
				args: [BigInt(i)],
			}),
		});

		const unpaddedSVG = await unpadSVG(
			`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none">${head}</svg>`,
		);

		await context.db
			.insert(nounsTraits)
			.values({
				id: `head:${i}`,
				type: "head",
				index: i,
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			})
			.onConflictDoUpdate({
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			});
	}
});

ponder.on("NounsArt:GlassesUpdated", async ({ event, context }) => {
	const glassesCount = Number(
		await context.client.readContract({
			address: context.contracts.NounsArt.address,
			abi: context.contracts.NounsArt.abi,
			functionName: "glassesCount",
		}),
	);

	for (let i = 0; i < glassesCount; i++) {
		const glasses = generateSVGPart({
			image: await context.client.readContract({
				address: context.contracts.NounsArt.address,
				abi: context.contracts.NounsArt.abi,
				functionName: "glasses",
				args: [BigInt(i)],
			}),
		});

		const unpaddedSVG = await unpadSVG(
			`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none">${glasses}</svg>`,
		);

		await context.db
			.insert(nounsTraits)
			.values({
				id: `glasses:${i}`,
				type: "glasses",
				index: i,
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			})
			.onConflictDoUpdate({
				image: unpaddedSVG.svg,
				padding: {
					left: unpaddedSVG.left,
					top: unpaddedSVG.top,
					right: unpaddedSVG.right,
					bottom: unpaddedSVG.bottom,
				},
			});
	}
});

ponder.on("NounsAuctionHouse:AuctionCreated", async ({ event, context }) => {
	const minBid = await context.client.readContract({
		address: context.contracts.NounsAuctionHouse.address,
		abi: context.contracts.NounsAuctionHouse.abi,
		functionName: "reservePrice",
	});

	await context.db.insert(nounsAuctions).values({
		nounId: event.args.nounId,
		startTime: new Date(Number(event.args.startTime) * 1000),
		endTime: new Date(Number(event.args.endTime) * 1000),
		settled: false,
		minBid,
	});
});

ponder.on("NounsAuctionHouse:AuctionBid", async ({ event, context }) => {
	// const ensName = await context.client.getEnsName({
	// 	address: event.args.sender,
	// });

	// if (ensName) {
	// 	const ensAvatar = await context.client.getEnsAvatar({
	// 		name: normalize(ensName),
	// 	});

	// 	await context.db
	// 		.insert(ensProfiles)
	// 		.values({
	// 			address: event.args.sender,
	// 			name: ensName,
	// 			image: ensAvatar,
	// 		})
	// 		.onConflictDoUpdate({
	// 			image: ensAvatar,
	// 			name: ensName,
	// 		});
	// }

	await context.db.insert(nounsBids).values({
		nounId: event.args.nounId,
		bidder: event.args.sender,
		amount: event.args.value,
		timestamp: new Date(Number(event.block.timestamp) * 1000),
	});
});

ponder.on(
	"NounsAuctionHouse:AuctionBidWithClientId",
	async ({ event, context }) => {
		await context.db
			.update(nounsBids, {
				nounId: event.args.nounId,
				amount: event.args.value,
			})
			.set({ client: event.args.clientId });
	},
);

ponder.on("NounsAuctionHouse:AuctionExtended", async ({ event, context }) => {
	await context.db
		.update(nounsAuctions, { nounId: event.args.nounId })
		.set({ endTime: new Date(Number(event.args.endTime) * 1000) });
});

ponder.on("NounsAuctionHouse:AuctionSettled", async ({ event, context }) => {
	await context.db
		.update(nounsAuctions, { nounId: event.args.nounId })
		.set({ settled: true });
});
