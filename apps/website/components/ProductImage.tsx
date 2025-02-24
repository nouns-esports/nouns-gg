"use client";

import type { getProduct } from "@/server/queries/shop";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function ProductImage(props: {
	product: NonNullable<Awaited<ReturnType<typeof getProduct>>>;
}) {
	const [index, setIndex] = useState(0);

	return (
		<div className="flex flex-col gap-2">
			<img
				src={`${props.product.images[index]}?img-width=500&img-onerror=redirect`}
				className="bg-black/30 rounded-xl w-80 h-80 object-contain p-2 flex-shrink-0 max-md:w-full max-md:h-auto max-md:aspect-square"
			/>
			<div className="flex w-full justify-between">
				<ChevronLeft
					onClick={() => {
						if (index < 1) return;
						setIndex(index - 1);
					}}
					className={twMerge(
						"w-6 h-6 text-white/40",
						index > 0 && "text-white cursor-pointer",
					)}
				/>
				<div className="flex items-center gap-1.5">
					{props.product.images.map((_, imageIndex) => (
						<button
							key={imageIndex}
							className={twMerge(
								"w-3 h-3 rounded-full bg-white/40",
								imageIndex === index && "bg-white",
							)}
							onClick={() => setIndex(imageIndex)}
						/>
					))}
				</div>
				<ChevronRight
					onClick={() => {
						if (index >= props.product.images.length - 1) return;
						setIndex(index + 1);
					}}
					className={twMerge(
						"w-6 h-6 text-white/40",
						index < props.product.images.length - 1 &&
							"text-white cursor-pointer",
					)}
				/>
			</div>
		</div>
	);
}
