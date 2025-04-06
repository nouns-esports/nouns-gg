import { db } from "~/packages/db";

export default async function Test() {
	let test1 = "";
	let test2 = "";
	let test3 = "";
	let test4 = "";
	let test5 = "";

	try {
		const test = await db.pgpool.query.nouns.findMany({
			limit: 10,
		});

		test1 = JSON.stringify(test, (_, value) =>
			typeof value === "bigint" ? value.toString() : value,
		);
	} catch (e) {
		if (e instanceof Error) {
			test1 = e.message;
		}
	}

	try {
		const test = await db.pgpool.query.nounDelegates.findMany({
			limit: 10,
		});

		test2 = JSON.stringify(test, (_, value) =>
			typeof value === "bigint" ? value.toString() : value,
		);
	} catch (e) {
		if (e instanceof Error) {
			test2 = e.message;
		}
	}

	try {
		const test = await db.pgpool.query.erc721Balances.findMany({
			limit: 10,
		});

		test3 = JSON.stringify(test, (_, value) =>
			typeof value === "bigint" ? value.toString() : value,
		);
	} catch (e) {
		if (e instanceof Error) {
			test3 = e.message;
		}
	}

	try {
		const test = await db.pgpool.query.nounsVotes.findMany({
			limit: 10,
		});

		test4 = JSON.stringify(test, (_, value) =>
			typeof value === "bigint" ? value.toString() : value,
		);
	} catch (e) {
		if (e instanceof Error) {
			test4 = e.message;
		}
	}

	try {
		const test = await db.pgpool.query.nounsBids.findMany({
			limit: 10,
		});

		test5 = JSON.stringify(test, (_, value) =>
			typeof value === "bigint" ? value.toString() : value,
		);
	} catch (e) {
		if (e instanceof Error) {
			test5 = e.message;
		}
	}

	console.log(db.pgpool.query.nouns);
	console.log(db.pgpool.query.erc721Balances);

	return (
		<div className="px-32 pt-64 flex flex-col gap-4 text-white">
			<p>nounDelegates: {test2}</p>
			<p>erc721Balances: {test3}</p>
			<p>nounsVotes: {test4}</p>
			<p>nounsBids: {test5}</p>
			<p>nouns: {test1}</p>
			<p>nouns query:{Object.keys(db.pgpool.query.nouns)}</p>
			<p>erc721Balances query:{Object.keys(db.pgpool.query.erc721Balances)}</p>
		</div>
	);
}
