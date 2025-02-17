"use client";

// @ts-ignore
import ReactFlipCountdown from "@rumess/react-flip-countdown";

export default function FlipCountdown(props: { date: Date | string }) {
	return (
		<ReactFlipCountdown
			endAt={new Date(props.date)}
			hideMonth
			hideYear
			endAtZero
			size="small"
		/>
	);
}
