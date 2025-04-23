import { twMerge } from "tailwind-merge";
import Link from "./Link";

export default function Image(props: {
	hash: string;
	alt: string;
	className?: string;
	link?: boolean;
	attribution?: {
		show?: boolean;
		margin?: number;
	};
	optimise?: {
		width?: number;
		height?: number;
		quality?: number;
		fit?: "";
	};
}) {
	return (
		<div
			className={twMerge(
				"relative overflow-hidden w-full h-full",
				props.className,
			)}
		>
			<div className="absolute w-full h-full before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:animate-shimmer before:absolute before:inset-0 " />
			<img
				src={`https://ipfs.nouns.gg/ipfs/${props.hash}?img-height=${props.optimise?.height ?? 200}&img-onerror=redirect`}
				alt={props.alt}
				className="relative w-full h-full object-cover z-10"
			/>
			{props.link ? (
				<Link
					href={`/creations/${props.hash}`}
					className="absolute w-full h-full z-10"
				/>
			) : (
				""
			)}
		</div>
	);
}
