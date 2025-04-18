"use client";

import type { getProduct } from "@/server/queries/shop";
import Link from "./Link";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { parseProduct } from "@/utils/parseProduct";

export default function ProductCard(props: {
	product: NonNullable<Awaited<ReturnType<typeof getProduct>>>;
}) {
	const price = Number(props.product.variants[0]?.price);

	const totalStock = props.product.variants.reduce(
		(acc, variant) => acc + (variant.inventory ?? Infinity),
		0,
	);

	const { colors, images, imageIndexFromColor } = parseProduct({
		product: props.product,
	});

	const [selectedColor, setSelectedColor] = useState(
		colors.length > 0 ? colors[0].id : undefined,
	);

	return (
		<Link
			href={`/shop/products/${props.product.handle}`}
			className={twMerge(
				"relative flex flex-col gap-4 rounded-xl bg-grey-800 hover:bg-grey-600 transition-colors p-4",
			)}
		>
			<img
				alt={props.product.name}
				src={`${images[selectedColor ? imageIndexFromColor[selectedColor] : 0]}?img-width=500&img-onerror=redirect`}
				className="aspect-square w-full object-contain rounded-lg"
			/>
			<div className="flex flex-col gap-2">
				<h2 className="text-white">{props.product.name}</h2>
				<div className="flex items-center justify-between gap-2">
					{totalStock < 1 ? (
						<p className="text-white bg-grey-500 px-2 py-1 rounded-md text-sm">
							Out of stock
						</p>
					) : (
						<div className="flex gap-2.5 items-center">
							<p className="text-white">${price.toFixed(2)}</p>

							<div className="w-0.5 h-4 bg-grey-500 rounded-full" />
							<div className="flex items-center gap-1.5">
								<img
									src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
									alt="Gold"
									className="w-5 h-5"
								/>
								<p className="text-[#FEBD1C] font-semibold">
									{(price * 100).toLocaleString()}
								</p>
							</div>
						</div>
					)}
					{colors.length > 1 ? (
						<div className="flex items-center gap-1.5">
							{colors.map((color) => (
								<button
									key={color.id}
									style={{ backgroundColor: color.hex }}
									className={twMerge(
										"flex items-center justify-center gap-1 w-8 h-8 rounded-md relative",
										selectedColor === color.id && "border-gold-500 border-2",
									)}
									onMouseEnter={() => setSelectedColor(color.id)}
									onMouseLeave={() => setSelectedColor(colors[0].id)}
								/>
							))}
						</div>
					) : null}
				</div>
			</div>
		</Link>
	);
}
