import Button from "@/components/Button";
import CartButton from "@/components/CartButton";
import Link from "@/components/Link";
import CartModal from "@/components/modals/CartModal";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/server/queries/shop";
import { twMerge } from "tailwind-merge";

export default async function Shop(props: {
	searchParams: Promise<{ collection?: string }>;
}) {
	const searchParams = await props.searchParams;

	const products = await getProducts();

	const collections = products.reduce(
		(acc, product) => {
			if (!acc.some((c) => c.handle === product.collections.nodes[0].handle)) {
				acc.push(product.collections.nodes[0]);
			}
			return acc;
		},
		[] as Array<{ title: string; handle: string }>,
	);

	return (
		<div className="flex flex-col gap-16 pt-32 max-xl:pt-28 max-sm:pt-20">
			<div className="px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 flex flex-col gap-16 max-sm:gap-8">
				<div className="relative w-full aspect-[3/1] max-sm:aspect-auto max-md:h-64 max-sm:h-48 rounded-xl overflow-hidden">
					<img
						alt="DOPAMINE x NOUNS"
						src="https://shop.nouns.gg/cdn/shop/files/DSC4949.png?v=1722017983"
						className="w-full h-full object-cover brightness-75"
					/>
					<div className="absolute top-4 left-4 flex gap-4 items-center">
						<img
							alt="DOPAMINE x NOUNS"
							src="https://shop.nouns.gg/cdn/shop/t/18/assets/logo.png?v=158144175520643272851725295698"
							className="w-12 h-12"
						/>
						<h2 className="text-4xl text-[#C9F301] font-luckiest-guy max-md:text-3xl">
							DOPAMINE x NOUNS
						</h2>
					</div>
					<div className="absolute bottom-4 left-4">
						<Button href="/shop?collection=dopamine-x-nouns#products">
							View Collection
						</Button>
					</div>
				</div>
				<div id="products" className="flex flex-col gap-8 max-sm:gap-4">
					<div className="flex justify-between items-center">
						<h1 className="text-white font-luckiest-guy text-4xl">Products</h1>
						<CartButton />
					</div>
					<ul className="flex gap-4">
						<li>
							<Link href="/shop">All</Link>
						</li>
						{collections.map((collection) => (
							<li
								key={collection.handle}
								className={twMerge(
									searchParams.collection === collection.handle
										? "text-white"
										: "text-grey-400",
								)}
							>
								<Link
									href={`/shop?collection=${collection.handle}`}
									scroll={false}
								>
									{collection.title}
								</Link>
							</li>
						))}
					</ul>
					<div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
						{products
							.filter((product) =>
								searchParams.collection
									? product.collections.nodes[0].handle ===
										searchParams.collection
									: true,
							)
							.map((product) => {
								if (!product.images.nodes[0]) return;
								if (
									!product.variants.nodes.some(
										(variant) => variant.availableForSale,
									)
								) {
									return;
								}

								return (
									<ProductCard
										key={product.id}
										id={product.id}
										handle={product.handle}
										image={product.images.nodes[0].url}
										name={product.title}
										price={product.variants.nodes[0].price.amount}
									/>
								);
							})}
					</div>
				</div>
			</div>
		</div>
	);
}
