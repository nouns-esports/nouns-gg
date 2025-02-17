"use client";

import { twMerge } from "tailwind-merge";
import Link from "./Link";

export default function Tabs(props: {
	id?: string;
	selected: string;
	options: Record<string, string>;
	onSelectionChange?: (selected: string) => void;
	fill?: boolean;
}) {
	const Component = props.onSelectionChange ? "button" : Link;
	return (
		<div
			className={twMerge(
				"flex items-center gap-1 bg-grey-600 rounded-lg px-1 py-1 text-sm",
				props.fill && "w-full",
			)}
		>
			{Object.entries(props.options).map(([key, name]) => (
				<Component
					key={key}
					href={`/leaderboard?${props.id}=${key}`}
					className={twMerge(
						"px-2 py-0.5 rounded-lg hover:bg-grey-500 hover:text-white transition-colors w-full flex items-center justify-center",
						props.fill && "flex-1",
						props.selected === key && "bg-grey-500 text-white",
					)}
					onClick={() => {
						props.onSelectionChange?.(key);
					}}
				>
					{name}
				</Component>
			))}
		</div>
	);
}
