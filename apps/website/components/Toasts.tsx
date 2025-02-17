"use client";

import { toast as hotToast } from "react-hot-toast";
import { Level } from "./Level";
import { Check, Sparkles, X } from "lucide-react";
import { twMerge } from "tailwind-merge";

export const toast = {
	custom: (props: {
		image: string;
		title: string;
		description: string;
		objectFit?: "cover" | "contain";
	}) =>
		hotToast.custom((t: any) => (
			<div className="flex w-80 animate-in fade-in-50 slide-in-from-top-4 items-center gap-3 border border-grey-600 rounded-xl p-2 pr-3 bg-grey-800">
				<img
					alt={`${props.title}. ${props.description}`}
					src={`${props.image}?img-width=50&img-onerror=redirect`}
					className={twMerge(
						"w-12 h-12 rounded-lg",
						props.objectFit === "contain" ? "object-contain" : "object-cover",
					)}
				/>
				<div className="flex flex-col">
					<h2 className="text-white line-clamp-1">{props.title}</h2>

					<p className="text-grey-200 text-sm line-clamp-1">
						{props.description}
					</p>
				</div>
			</div>
		)),
	xp: (props: { total: number; earned: number }) =>
		hotToast.custom((t: any) => (
			<div className="flex flex-col w-80 animate-in fade-in-50 slide-in-from-top-4 gap-3 border border-grey-600 rounded-xl p-2 pr-3 bg-grey-800">
				<div className="flex gap-2 justify-between items-center">
					<p className="text-white">You earned XP!</p>
					<p className="text-white flex items-center gap-1.5">
						<Sparkles className="w-4 h-4 text-green" />
						{props.earned}
					</p>
				</div>
				<Level xp={props.total} />
			</div>
		)),
	error: (message: string) =>
		hotToast.custom((t: any) => (
			<div className="flex w-fit max-w-[500px] max-sm:max-w-full animate-in text-white fade-in-50 slide-in-from-top-4 items-center gap-3 border border-grey-600 rounded-xl p-2 pr-3 bg-grey-800">
				<X className="w-6 h-6 flex-shrink-0 text-white bg-red rounded-full p-1" />
				{message}
			</div>
		)),
	success: (message: string) =>
		hotToast.custom((t: any) => (
			<div className="flex w-fit max-w-[500px] max-sm:max-w-full text-white animate-in fade-in-50 slide-in-from-top-4 items-center gap-3 border border-grey-600 rounded-xl p-2 pr-3 bg-grey-800">
				<Check className="w-6 h-6 flex-shrink-0 text-white bg-green p-1 rounded-full" />
				{message}
			</div>
		)),
};
