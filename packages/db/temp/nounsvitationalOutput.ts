// import { eq, isNotNull, isNull } from "drizzle-orm";
// import { db } from ".";
// import { proposals, rounds } from "./schema/public";
// import fs from "fs";

// // Staff user ids (to be filled in)
// const staff = {
// 	sam: "31ce3668-ea97-45da-9fb1-6cefab2bc7a5",
// 	sasquatch: "d6a7ac81-b0d6-451b-b5b0-e16a26a4881c",
// 	peter: "7937f05d-d1da-47e2-a90e-20b5c73c0b95",
// 	ohan: "f94c306a-0a1a-40b7-a55e-0c84856c4d85",
// };

// // Helper to escape CSV values
// function escapeCSV(val: any): string {
// 	if (val === null || val === undefined) return "";
// 	const str = String(val).replace(/"/g, '""');
// 	if (str.includes(",") || str.includes("\n") || str.includes('"')) {
// 		return `"${str}"`;
// 	}
// 	return str;
// }

// // Helper to convert array of objects to CSV string
// function toCSV(rows: any[], columns: string[]): string {
// 	const header = columns.join(",");
// 	const data = rows.map((row) =>
// 		columns.map((col) => escapeCSV(row[col])).join(","),
// 	);
// 	return [header, ...data].join("\n");
// }

// // Helper to get user id or "Deleted User"
// function getUserId(user: { id?: string } | null | undefined): string {
// 	return user?.id ?? "Deleted User";
// }

// function getUserName(user: { name?: string } | null | undefined): string {
// 	return user?.name ?? "Deleted User";
// }

// // Query rounds (replace ids as needed)
// const round1 = await db.primary.query.rounds.findFirst({
// 	where: eq(rounds.id, "b9b80bdd-69d6-4172-bc34-85ede97fb038"),
// 	with: {
// 		proposals: { where: isNull(proposals.hiddenAt), with: { user: true } },
// 		votes: { with: { user: true } },
// 		purchasedVotes: { with: { user: true } },
// 	},
// });
// const round2 = await db.primary.query.rounds.findFirst({
// 	where: eq(rounds.id, "c6fd484a-67e7-4ccb-97ac-4cbeb2a07405"),
// 	with: {
// 		proposals: { where: isNull(proposals.hiddenAt), with: { user: true } },
// 		votes: { with: { user: true } },
// 		purchasedVotes: { with: { user: true } },
// 	},
// });
// const round3 = await db.primary.query.rounds.findFirst({
// 	where: eq(rounds.id, "efaecac8-883f-4a57-91c4-4ca47d917895"),
// 	with: {
// 		proposals: { where: isNull(proposals.hiddenAt), with: { user: true } },
// 		votes: { with: { user: true } },
// 		purchasedVotes: { with: { user: true } },
// 	},
// });

// if (!round1 || !round2 || !round3) {
// 	throw new Error("Round not found");
// }

// // Proposals CSVs
// const proposalColumns = ["id", "title", "createdAt", "userId", "userName"];
// const round1Proposals = toCSV(
// 	round1.proposals.map((p) => ({
// 		id: p.id,
// 		title: p.title,
// 		createdAt: p.createdAt,
// 		userId: getUserId(p.user),
// 		userName: getUserName(p.user),
// 	})),
// 	proposalColumns,
// );
// const round2Proposals = toCSV(
// 	round2.proposals.map((p) => ({
// 		id: p.id,
// 		title: p.title,
// 		createdAt: p.createdAt,
// 		userId: getUserId(p.user),
// 		userName: getUserName(p.user),
// 	})),
// 	proposalColumns,
// );
// const round3Proposals = toCSV(
// 	round3.proposals.map((p) => ({
// 		id: p.id,
// 		title: p.title,
// 		createdAt: p.createdAt,
// 		userId: getUserId(p.user),
// 		userName: getUserName(p.user),
// 	})),
// 	proposalColumns,
// );

// // Votes CSVs
// const voteColumns = [
// 	"id",
// 	"proposal",
// 	"count",
// 	"timestamp",
// 	"userId",
// 	"userName",
// ];
// const round1Votes = toCSV(
// 	round1.votes.map((v) => ({
// 		id: v.id,
// 		proposal: v.proposal,
// 		count: v.count,
// 		timestamp: v.timestamp,
// 		userId: getUserId(v.user),
// 		userName: getUserName(v.user),
// 	})),
// 	voteColumns,
// );
// const round2Votes = toCSV(
// 	round2.votes.map((v) => ({
// 		id: v.id,
// 		proposal: v.proposal,
// 		count: v.count,
// 		timestamp: v.timestamp,
// 		userId: getUserId(v.user),
// 		userName: getUserName(v.user),
// 	})),
// 	voteColumns,
// );
// const round3Votes = toCSV(
// 	round3.votes.map((v) => ({
// 		id: v.id,
// 		proposal: v.proposal,
// 		count: v.count,
// 		timestamp: v.timestamp,
// 		userId: getUserId(v.user),
// 		userName: getUserName(v.user),
// 	})),
// 	voteColumns,
// );

// // PurchasedVotes CSVs
// const purchasedVoteColumns = [
// 	"id",
// 	"timestamp",
// 	"count",
// 	"used",
// 	"userId",
// 	"userName",
// ];
// const round1PurchasedVotes = toCSV(
// 	round1.purchasedVotes.map((pv) => ({
// 		id: pv.id,
// 		timestamp: pv.timestamp,
// 		count: pv.count,
// 		used: pv.used,
// 		userId: getUserId(pv.user),
// 		userName: getUserName(pv.user),
// 	})),
// 	purchasedVoteColumns,
// );
// const round2PurchasedVotes = toCSV(
// 	round2.purchasedVotes.map((pv) => ({
// 		id: pv.id,
// 		timestamp: pv.timestamp,
// 		count: pv.count,
// 		used: pv.used,
// 		userId: getUserId(pv.user),
// 		userName: getUserName(pv.user),
// 	})),
// 	purchasedVoteColumns,
// );
// const round3PurchasedVotes = toCSV(
// 	round3.purchasedVotes.map((pv) => ({
// 		id: pv.id,
// 		timestamp: pv.timestamp,
// 		count: pv.count,
// 		used: pv.used,
// 		userId: getUserId(pv.user),
// 		userName: getUserName(pv.user),
// 	})),
// 	purchasedVoteColumns,
// );

// // Staff Votes CSVs (filter votes by staff user ids)
// const staffUserIds = Object.values(staff).filter(Boolean);

// const round1StaffVotes = toCSV(
// 	round1.votes
// 		.filter((v) => staffUserIds.includes(v.user?.id ?? ""))
// 		.map((v) => ({
// 			id: v.id,
// 			proposal: v.proposal,
// 			count: v.count,
// 			timestamp: v.timestamp,
// 			userId: getUserId(v.user),
// 			userName: getUserName(v.user),
// 		})),
// 	voteColumns,
// );
// const round2StaffVotes = toCSV(
// 	round2.votes
// 		.filter((v) => staffUserIds.includes(v.user?.id ?? ""))
// 		.map((v) => ({
// 			id: v.id,
// 			proposal: v.proposal,
// 			count: v.count,
// 			timestamp: v.timestamp,
// 			userId: getUserId(v.user),
// 			userName: getUserName(v.user),
// 		})),
// 	voteColumns,
// );
// const round3StaffVotes = toCSV(
// 	round3.votes
// 		.filter((v) => staffUserIds.includes(v.user?.id ?? ""))
// 		.map((v) => ({
// 			id: v.id,
// 			proposal: v.proposal,
// 			count: v.count,
// 			timestamp: v.timestamp,
// 			userId: getUserId(v.user),
// 			userName: getUserName(v.user),
// 		})),
// 	voteColumns,
// );

// // Staff PurchasedVotes CSVs (filter purchasedVotes by staff user ids)
// const round1StaffPurchasedVotes = toCSV(
// 	round1.purchasedVotes
// 		.filter((pv) => staffUserIds.includes(pv.user?.id ?? ""))
// 		.map((pv) => ({
// 			id: pv.id,
// 			timestamp: pv.timestamp,
// 			count: pv.count,
// 			used: pv.used,
// 			userId: getUserId(pv.user),
// 			userName: getUserName(pv.user),
// 		})),
// 	purchasedVoteColumns,
// );
// const round2StaffPurchasedVotes = toCSV(
// 	round2.purchasedVotes
// 		.filter((pv) => staffUserIds.includes(pv.user?.id ?? ""))
// 		.map((pv) => ({
// 			id: pv.id,
// 			timestamp: pv.timestamp,
// 			count: pv.count,
// 			used: pv.used,
// 			userId: getUserId(pv.user),
// 			userName: getUserName(pv.user),
// 		})),
// 	purchasedVoteColumns,
// );
// const round3StaffPurchasedVotes = toCSV(
// 	round3.purchasedVotes
// 		.filter((pv) => staffUserIds.includes(pv.user?.id ?? ""))
// 		.map((pv) => ({
// 			id: pv.id,
// 			timestamp: pv.timestamp,
// 			count: pv.count,
// 			used: pv.used,
// 			userId: getUserId(pv.user),
// 			userName: getUserName(pv.user),
// 		})),
// 	purchasedVoteColumns,
// );

// fs.writeFileSync("round1_proposals.csv", round1Proposals);
// fs.writeFileSync("round2_proposals.csv", round2Proposals);
// fs.writeFileSync("round3_proposals.csv", round3Proposals);
// fs.writeFileSync("round1_votes.csv", round1Votes);
// fs.writeFileSync("round2_votes.csv", round2Votes);
// fs.writeFileSync("round3_votes.csv", round3Votes);
// fs.writeFileSync("round1_purchased_votes.csv", round1PurchasedVotes);
// fs.writeFileSync("round2_purchased_votes.csv", round2PurchasedVotes);
// fs.writeFileSync("round3_purchased_votes.csv", round3PurchasedVotes);
// fs.writeFileSync("round1_staff_votes.csv", round1StaffVotes);
// fs.writeFileSync("round2_staff_votes.csv", round2StaffVotes);
// fs.writeFileSync("round3_staff_votes.csv", round3StaffVotes);
// fs.writeFileSync("round1_staff_purchased_votes.csv", round1StaffPurchasedVotes);
// fs.writeFileSync("round2_staff_purchased_votes.csv", round2StaffPurchasedVotes);
// fs.writeFileSync("round3_staff_purchased_votes.csv", round3StaffPurchasedVotes);
