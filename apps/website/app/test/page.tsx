import { db } from "~/packages/db";

export default async function Test() {
	let error = "";

	try {
		const test = await db.pgpool.query.nouns.findMany({
			limit: 10,
		});
	} catch (e) {
		if (e instanceof Error) {
			error = e.message;
		}
	}

	const test = await db.pgpool.query.nounDelegates.findMany({
		limit: 10,
	});

	return (
		<div className="px-32 pt-64">
			{error}
			{JSON.stringify(test)}
		</div>
	);
}
