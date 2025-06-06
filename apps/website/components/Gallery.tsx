"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "./Button";
import { twMerge } from "tailwind-merge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { rounds, events } from "~/packages/db/schema/public";
import { roundState } from "@/utils/roundState";

export default function Gallery(props: {
	highlightedRound?: typeof rounds.$inferSelect;
	highlightedEvent?: typeof events.$inferSelect;
}) {
	const [index, setIndex] = useState(0);
	const [backwards, setBackwards] = useState(false);

	const slides = useMemo<
		Array<{
			title: string;
			sub: string;
			href: string;
			button: string;
			type: "video" | "image";
			url: string;
		}>
	>(
		() => [
			{
				title: "Introducing Nounsvitational Tokyo 2025",
				sub: "Coming in December",
				href: "/events/nounsvitational?tab=shop",
				button: "Get VIP Pass",
				type: "video",
				url: "https://ipfs.nouns.gg/ipfs/bafybeihciy2yrpxczsitnl2732j5sfccx7bqw6swon6ae7tolaaa3mk7jy",
			},
			...(props.highlightedRound
				? ([
						{
							title: props.highlightedRound.name,
							sub: {
								Voting: "Now voting",
								Ended: "",
								Proposing: "Now proposing",
								Upcoming: "Starting soon",
							}[roundState(props.highlightedRound)],
							href: `/rounds/${props.highlightedRound.handle}`,
							button: "View Round",
							type: "image",
							url: props.highlightedRound.image,
						},
					] as const)
				: []),
			...(props.highlightedEvent
				? ([
						{
							title: props.highlightedEvent.name,
							sub: `Coming in ${new Date(props.highlightedEvent.start).toLocaleString("default", { month: "long" })}`,
							href: `/events/${props.highlightedEvent.handle}`,
							button: "View Event",
							type: "image",
							url: props.highlightedEvent.image,
						},
					] as const)
				: []),
		],
		[props.highlightedEvent, props.highlightedRound],
	);

	const backgroundRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (backwards) {
				backgroundRef.current?.scrollTo({
					left: backgroundRef.current.clientWidth * (index - 1),
					behavior: "smooth",
				});

				return;
			}

			backgroundRef.current?.scrollTo({
				left: backgroundRef.current.clientWidth * (index + 1) + 1,
				behavior: "smooth",
			});
		}, 5000);
		return () => clearInterval(intervalId);
	}, [index, backwards]);

	return (
		<div className="relative rounded-xl flex-shrink-0 aspect-video max-lg:w-full max-lg:h-auto overflow-hidden select-none">
			<div className="absolute z-10 top-0 left-0 w-full h-full flex flex-col justify-between p-4 max-sm:p-4 pointer-events-none">
				<div className="flex flex-col gap-1">
					<p className="text-white text-base max-[400px]:leading-none">
						{slides[index].sub}
					</p>
					<h1 className="text-white font-luckiest-guy text-2xl max-sm:text-2xl max-sm:leading-none max-[400px]:text-xl">
						{slides[index].title}
					</h1>
				</div>
				<div className="flex items-center justify-between pointer-events-auto">
					<Button href={slides[index].href}>{slides[index].button}</Button>
					<div className="flex items-center gap-1 pr-6">
						<ChevronLeft
							onClick={() => {
								if (index < 1) return;

								backgroundRef.current?.scrollTo({
									left: backgroundRef.current.clientWidth * (index - 1),
									behavior: "smooth",
								});
							}}
							className={twMerge(
								"w-5 h-5 text-white/40",
								index > 0 && "text-white cursor-pointer",
							)}
						/>
						{slides.map((_, slideIndex) => (
							<button
								key={slideIndex}
								className={twMerge(
									"w-3 h-3 rounded-full bg-white/40",
									slideIndex === index && "bg-white",
								)}
								onClick={() => {
									backgroundRef.current?.scrollTo({
										left: slideIndex * backgroundRef.current.clientWidth,
										behavior: "smooth",
									});
								}}
							/>
						))}
						<ChevronRight
							onClick={() => {
								if (index > slides.length) return;

								backgroundRef.current?.scrollTo({
									left: backgroundRef.current.clientWidth * (index + 1) + 1,
									behavior: "smooth",
								});
							}}
							className={twMerge(
								"w-5 h-5 text-white/40",
								index < slides.length - 1 && "text-white cursor-pointer",
							)}
						/>
					</div>
				</div>
			</div>
			<div
				ref={backgroundRef}
				className="w-full h-full flex scrollbar-hidden overflow-scroll snap-x snap-mandatory scroll-smooth"
				onScroll={(e) => {
					const scrollLeft = e.currentTarget.scrollLeft;
					const width = e.currentTarget.clientWidth;
					const nextIndex = Math.floor((scrollLeft + width / 2) / width);

					if (nextIndex === 0) setBackwards(false);
					if (nextIndex === slides.length - 1) setBackwards(true);

					setIndex(nextIndex);
				}}
			>
				{slides.map((slide, i) => (
					<div key={i} className="flex-shrink-0 w-full h-full snap-center">
						{slide.type === "video" ? (
							<video
								src={slide.url}
								autoPlay
								muted
								loop
								playsInline
								className="w-full h-full object-cover brightness-75"
							/>
						) : (
							<img
								src={slide.url}
								alt={slide.title}
								draggable={false}
								className="w-full h-full object-cover brightness-75"
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
