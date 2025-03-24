export function estimateTimestamp(props: {
	blocks: number;
	now?: Date;
}) {
	const now = props.now ?? new Date();

	console.log(
		"ESTIMATING TIMESTAMP",
		props.blocks,
		now.getTime(),
		new Date(now.getTime() + props.blocks * 12 * 1000),
	);

	return new Date(now.getTime() + props.blocks * 12 * 1000);
}
