import { twMerge } from "tailwind-merge";

export default function LimitMeter(props: {
	value: number;
	min: number;
	max: number;
}) {
	return (
		<div className="flex items-center gap-2">
			<small
				className={twMerge(
					props.value < props.min
						? props.value / props.min > 0.5
							? "text-yellow"
							: "text-red"
						: props.value < props.max
							? props.value / props.max < 0.5
								? "text-green"
								: props.value / props.max < 0.75
									? "text-yellow"
									: "text-red"
							: "text-red",
				)}
			>
				{props.value < props.min
					? `You need at least ${props.min - props.value} more character${
							props.min - props.value === 1 ? "" : "s"
						}`
					: props.value >= props.max
						? "Character limit reached"
						: props.max === Infinity
							? "Character requirements met"
							: `${props.max - props.value} character${
									props.max - props.value === 1 ? "" : "s"
								} remain${props.max - props.value === 1 ? "s" : ""}`}
			</small>
			{props.value < props.max ? (
				<svg width={16} height={16}>
					<circle
						className="fill-none stroke-grey-600 stroke-[2px]"
						cx="8"
						cy="8"
						r="6"
					/>
					<circle
						className={twMerge(
							"fill-none stroke-[2px]",
							props.value < props.min
								? props.value / props.min > 0.5
									? "stroke-yellow"
									: "stroke-red"
								: props.value < props.max
									? props.value / props.max < 0.5
										? "stroke-green"
										: props.value / props.max < 0.75
											? "stroke-yellow"
											: "stroke-red"
									: "",
						)}
						cx="8"
						cy="8"
						r="6"
						strokeDasharray={2 * Math.PI * 6}
						strokeDashoffset={
							2 *
							Math.PI *
							6 *
							(props.value / (props.value < props.min ? props.min : props.max))
						}
					/>
				</svg>
			) : (
				""
			)}
		</div>
	);
}
