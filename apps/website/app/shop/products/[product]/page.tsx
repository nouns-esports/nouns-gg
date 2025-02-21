import AddToCartButton from "@/components/AddToCartButton";
import Button from "@/components/Button";
import Link from "@/components/Link";
import { getProduct } from "@/server/queries/shop";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "~/env";
import { twMerge } from "tailwind-merge";

export async function generateMetadata(props: {
	params: Promise<{ product: string }>;
}): Promise<Metadata> {
	const params = await props.params;

	const product = await getProduct({ id: params.product });

	if (!product) {
		return notFound();
	}

	return {
		title: product.name,
		description: product.description,
		openGraph: {
			type: "website",
			images: [product.images[0]],
		},
		twitter: {
			site: "@NounsGG",
			card: "summary_large_image",
			images: [product.images[0]],
		},
		other: {
			"fc:frame": JSON.stringify({
				version: "next",
				imageUrl: product.images[0],
				button: {
					title: "Buy",
					action: {
						type: "launch_frame",
						name: "Nouns GG",
						url: `${env.NEXT_PUBLIC_DOMAIN}/shop`,
						splashImageUrl:
							"https://ipfs.nouns.gg/ipfs/bafkreia2vysupa4ctmftg5ro73igggkq4fzgqjfjqdafntylwlnfclziey",
						splashBackgroundColor: "#040404",
					},
				},
			}),
		},
	};
}

export default async function ProductPage(props: {
	params: Promise<{ product: string }>;
	searchParams: Promise<{ size?: string }>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;

	const product = await getProduct({ id: params.product });

	if (!product) {
		return notFound();
	}

	const variant =
		product.variants.find((v) => {
			if (searchParams.size && product.variants.length > 1) {
				return v.size === searchParams.size;
			}

			return v.inventory > 0;
		}) ?? product.variants[0];

	if (!variant) {
		return notFound();
	}

	const totalStock = product.variants.reduce(
		(acc, variant) => acc + variant.inventory,
		0,
	);

	return (
		<div className="flex justify-center gap-4 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
			<div className="bg-grey-800 rounded-xl p-4 flex gap-4 max-md:gap-2 max-w-4xl w-full max-md:flex-col">
				<img
					src={`${product.images[0]}?img-width=500&img-onerror=redirect`}
					className="bg-black/30 rounded-xl w-80 h-80 object-contain p-2 flex-shrink-0 max-md:w-full max-md:h-auto max-md:aspect-square"
				/>
				<div className="flex flex-col gap-4 max-md:gap-2">
					<div className="flex flex-col gap-4 max-md:gap-2">
						<h1 className="text-white text-3xl max-sm:text-2xl font-luckiest-guy">
							{product.name}
						</h1>
						<div className="flex gap-2.5 items-center">
							<p className="text-white text-lg">
								$
								{Number.isInteger(variant.price)
									? variant.price
									: variant.price.toFixed(2)}
							</p>
							<div className="w-0.5 h-5 bg-grey-500 rounded-full" />
							<div className="flex items-center gap-1.5">
								<img
									src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
									alt="Gold"
									className="w-5 h-5"
								/>
								<p className="text-[#FEBD1C] text-lg font-semibold">
									{(variant.price * 100).toLocaleString()}
								</p>
							</div>
						</div>
						<p className="text-grey-200">{product.description}</p>
					</div>
					<div className="flex items-center gap-4 max-sm:flex-col-reverse max-sm:items-start">
						<AddToCartButton
							inventory={variant.inventory}
							product={product.id}
							variant={variant.shopifyId}
							image={product.images[0]}
							name={product.name}
						/>
						{product.variants.length > 1 ? (
							<div className="flex items-center gap-1.5">
								{product.variants.map((v) => (
									<Link
										href={`/shop/products/${product.id}?size=${v.size}`}
										key={v.shopifyId}
										className={twMerge(
											"flex items-center justify-center gap-1 w-8 h-8 text-sm text-grey-200 rounded-md border border-white/10 relative",
											v.size === variant.size && "bg-white/10",
										)}
									>
										{v.size?.toUpperCase()}
									</Link>
								))}
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
