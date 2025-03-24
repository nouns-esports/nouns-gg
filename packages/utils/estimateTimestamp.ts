export function estimateTimestamp(props: {
	blocks: number;
	now?: Date;
}) {
	const now = props.now ?? new Date();

	return new Date(now.getTime() + props.blocks * 12 * 1000);
}
