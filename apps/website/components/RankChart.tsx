"use client";

import type { getUserRankings } from "@/server/queries/rankings";
import {
	LineChart,
	Line,
	ResponsiveContainer,
	ReferenceArea,
	YAxis,
	ReferenceLine,
} from "recharts";
import type { ranks } from "~/packages/db/schema/public";

export default function RankChart(props: {
	userRankings: Awaited<ReturnType<typeof getUserRankings>>;
	ranks: Array<typeof ranks.$inferSelect>;
}) {
	if (props.userRankings.length === 0) {
		return null;
	}

	return (
		<ResponsiveContainer
			width="100%"
			height="100%"
			className="rounded-lg overflow-hidden"
		>
			<LineChart
				data={
					props.userRankings.length > 0
						? [
								...(props.userRankings.length === 1
									? [
											{
												name: new Date().getTime(),
												rank: 0,
											},
										]
									: []),
								...props.userRankings.map((ranking) => ({
									name: new Date(ranking.timestamp).getTime(),
									rank: ranking.rank?.place ?? 0,
								})),
							]
						: [
								{
									name: new Date().getTime(),
									rank: 0,
								},
								{
									name: new Date().getTime(),
									rank: 0,
								},
							]
				}
				margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
			>
				<Line
					type="monotone"
					dataKey="rank"
					stroke="#F2F2F2"
					dot={false}
					strokeWidth={2}
				/>
				<YAxis domain={[0, 8]} hide={true} />
				{props.ranks.map((rank, index) => {
					const sectionHeight = (props.ranks.length - 1) / 3;
					return (
						<ReferenceArea
							key={rank.name}
							y1={index * sectionHeight}
							y2={(index + 1) * sectionHeight}
							fill={
								index === 0 ? "#4990FD" : index === 1 ? "#DA00CB" : "#F00000"
							}
							fillOpacity={0.25}
						/>
					);
				})}
			</LineChart>
		</ResponsiveContainer>
	);
}
