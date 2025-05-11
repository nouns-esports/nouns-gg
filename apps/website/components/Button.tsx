"use client";

import Link from "@/components/Link";
import { twMerge } from "tailwind-merge";

export default function Button(props: {
	disabled?: boolean;
	href?: string;
	newTab?: boolean;
	onClick?: (e: React.MouseEvent<any>) => void;
	backgroundColor?: string;
	scroll?: boolean;
	form?: boolean;
	size?: "sm" | "md" | "lg";
	loading?: boolean;
	children: React.ReactNode;
	fill?: boolean;
	className?: string;
}) {
	const Component = props.href ? Link : props.form ? "input" : "button";

	return (
		<Component
			disabled={props.disabled}
			onClick={props.onClick ? (e) => props.onClick!(e) : undefined}
			// @ts-ignore
			href={props.href}
			{...(props.href
				? {
						newTab: props.newTab,
					}
				: {})}
			type={props.form ? "submit" : undefined}
			scroll={!!props.href && props.scroll ? true : undefined}
			className={twMerge(
				"relative w-min cursor-pointer",
				props.fill && "w-full",
				props.disabled && props.href && "pointer-events-none",
				props.className,
			)}
		>
			<div
				className={twMerge(
					"relative select-none text-grey-800 bg-white rounded-full flex items-center justify-center leading-none font-bebas-neue whitespace-nowrap",
					props.size === "lg" && "py-3 px-[22px] text-2xl",
					(props.size === "md" || !props.size) && "py-1.5 px-4 text-xl",
					props.size === "sm" && "py-1 px-3 text-lg",
					props.disabled
						? "brightness-50 cursor-not-allowed"
						: "hover:brightness-75 transition-all",

					props.loading && "gap-2 pl-5 pr-6",
				)}
			>
				{props.loading ? (
					<img
						alt="Loading spinner"
						src="/spinner.svg"
						className="h-[18px] animate-spin"
					/>
				) : (
					""
				)}
				{props.children}
			</div>
		</Component>
	);
}
