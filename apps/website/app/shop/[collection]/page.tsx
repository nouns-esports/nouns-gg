import Link from "@/components/Link";
import ProductCard from "@/components/ProductCard";
import { getCollection } from "@/server/queries/shop";
import { ArrowLeft } from "lucide-react";

export default async function CollectionPage(props: {
	params: Promise<{ collection: string }>;
}) {
	const params = await props.params;

	const collection = await getCollection({ id: params.collection });

	if (!collection) {
		return <div>Collection not found</div>;
	}

	return (
		<div className="flex flex-col w-full items-center">
			<div className="flex flex-col gap-16 pt-32 max-xl:pt-28 max-sm:pt-20 max-w-[1920px]">
				<div className="px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 flex flex-col gap-16 max-sm:gap-8">
					<div className="flex flex-col gap-8 max-sm:gap-4">
						<Link
							href="/shop"
							className="text-red flex items-center gap-1 group"
						>
							<ArrowLeft className="w-5 h-5 text-red group-hover:-translate-x-1 transition-transform" />
							Back to shop
						</Link>
						<div className="flex justify-between items-center">
							<h1 className="text-white font-luckiest-guy text-4xl">
								{collection.name}
							</h1>
						</div>
						<div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
							{collection.products.map((product) => {
								return <ProductCard key={product.id} product={product} />;
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
