import { db } from "~/packages/db";

export default async function Test() {
	const test = await db.pgpool.query.erc721Balances.findMany({
		limit: 10,
	});

	console.log(test);

	return (
		<div className="px-32 pt-64">
			{test.map((t, index) => (
				<div key={index}>{t.toString()}</div>
			))}
		</div>
	);
}
