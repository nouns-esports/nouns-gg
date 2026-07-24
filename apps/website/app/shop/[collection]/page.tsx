import ProductCard from "@/components/ProductCard";
import { getCollection } from "@/server/queries/shop";
import { notFound } from "next/navigation";
import { collectionParams } from "@/server/data/params";

export function generateStaticParams() {
	return collectionParams;
}

export default async function CollectionPage(props: {
	params: Promise<{ collection: string }>;
}) {
	const collection = await getCollection({
		handle: (await props.params).collection,
	});
	if (!collection) return notFound();
	return (
		<div className="flex w-full flex-col items-center px-32 pt-32 max-2xl:px-16 max-xl:px-8 max-xl:pt-28 max-sm:px-4 max-sm:pt-20">
			<div className="w-full max-w-[1920px]">
				<h1 className="mb-8 font-luckiest-guy text-4xl text-white">
					{collection.name}
				</h1>
				<div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
					{collection.products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</div>
	);
}
