import Button from "@/components/Button";
import CartButton from "@/components/CartButton";
import Link from "@/components/Link";
import CartModal from "@/components/modals/CartModal";
import ProductCard from "@/components/ProductCard";
import { getCollections, getProducts } from "@/server/queries/shop";
import { twMerge } from "tailwind-merge";

export default async function Shop(props: {
	searchParams: Promise<{ collection?: string }>;
}) {
	const searchParams = await props.searchParams;

	const products = await getProducts({ collection: searchParams.collection });

	const collections = await getCollections();

	const featuredCollection = collections.find(
		(collection) => collection.featured,
	);

	return (
		<div className="flex flex-col gap-16 pt-32 max-xl:pt-28 max-sm:pt-20">
			<div className="px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 flex flex-col gap-16 max-sm:gap-8">
				{featuredCollection ? (
					<div className="relative w-full aspect-[3/1] max-sm:aspect-auto max-md:h-64 max-sm:h-48 rounded-xl overflow-hidden">
						<img
							alt={featuredCollection.name}
							src={featuredCollection.image}
							className="w-full h-full object-cover brightness-75"
						/>
						<div className="absolute top-4 left-4 flex gap-4 items-center">
							{/* <img
								alt={featuredCollection.name}
								src="https://shop.nouns.gg/cdn/shop/t/18/assets/logo.png?v=158144175520643272851725295698"
								className="w-12 h-12"
							/> */}
							<h2 className="text-4xl text-[#C9F301] font-luckiest-guy max-md:text-3xl">
								{featuredCollection.name}
							</h2>
						</div>
						<div className="absolute bottom-4 left-4">
							<Button href={`/shop/${featuredCollection.id}`}>
								View Collection
							</Button>
						</div>
					</div>
				) : null}
				<div className="flex flex-col gap-8 max-sm:gap-4">
					<div className="flex justify-between items-center">
						<h1 className="text-white font-luckiest-guy text-4xl">Products</h1>
						<CartButton />
					</div>
					<ul className="flex gap-2">
						<CategoryTag selected={!searchParams.collection}>All</CategoryTag>
						{collections.map((collection) => (
							<CategoryTag
								key={collection.id}
								id={collection.id}
								selected={searchParams.collection === collection.id}
							>
								{collection.name}
							</CategoryTag>
						))}
					</ul>
					<div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function CategoryTag(props: {
	id?: string;
	selected: boolean;
	children: string;
}) {
	return (
		<li
			className={twMerge(
				"bg-grey-800 text-grey-200 rounded-md px-3 py-1 font-semibold hover:bg-grey-600 hover:text-white transition-colors",
				props.selected ? "text-white bg-grey-600" : "",
			)}
		>
			<Link
				href={`/shop${props.id ? `?collection=${props.id}` : ""}`}
				scroll={false}
			>
				{props.children}
			</Link>
		</li>
	);
}
