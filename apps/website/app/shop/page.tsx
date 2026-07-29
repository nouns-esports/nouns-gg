import { siteConfig } from "@/config";
import ProductCard from "@/components/ProductCard";
import RaffleCard from "@/components/RaffleCard";
import { getRaffles } from "@/server/queries/raffles";
import { getCollections, getProducts } from "@/server/queries/shop";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Shop",
	metadataBase: new URL(siteConfig.domain),
};

export default async function Shop() {
	const [products, collections, raffles] = await Promise.all([
		getProducts({}),
		getCollections(),
		getRaffles(),
	]);
	return (
		<div className="flex w-full flex-col items-center px-32 pt-32 max-2xl:px-16 max-xl:px-8 max-xl:pt-28 max-sm:px-4 max-sm:pt-20">
			<div className="flex w-full max-w-[1920px] flex-col gap-10">
				<div>
					<h1 className="font-luckiest-guy text-4xl text-white">Shop</h1>
				</div>
				{raffles.length ? (
					<section>
						<h2 className="mb-4 font-luckiest-guy text-2xl text-white">Raffles</h2>
						<div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
							{raffles.map((raffle) => (
								<RaffleCard key={raffle.id} raffle={raffle} />
							))}
						</div>
					</section>
				) : null}
				<section>
					<h2 className="mb-4 font-luckiest-guy text-2xl text-white">Products</h2>
					<div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</section>
			</div>
		</div>
	);
}
