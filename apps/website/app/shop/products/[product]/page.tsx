import { siteConfig } from "@/config";
import NavigateBack from "@/components/NavigateBack";
import TipTap from "@/components/TipTap";
import { getProduct } from "@/server/queries/shop";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productParams } from "@/server/data/params";

export function generateStaticParams() {
	return productParams;
}

export async function generateMetadata(props: {
	params: Promise<{ product: string }>;
}): Promise<Metadata> {
	const product = await getProduct({ handle: (await props.params).product });
	if (!product) return notFound();
	return {
		title: product.name,
		metadataBase: new URL(siteConfig.domain),
		openGraph: { images: product.variants[0]?.images?.slice(0, 1) ?? [] },
	};
}

export default async function ProductPage(props: {
	params: Promise<{ product: string }>;
}) {
	const product = await getProduct({ handle: (await props.params).product });
	if (!product) return notFound();
	const images = product.variants.flatMap((variant: any) => variant.images ?? []);
	return (
		<div className="flex justify-center px-32 pt-32 max-2xl:px-16 max-xl:px-8 max-xl:pt-28 max-sm:px-4 max-sm:pt-20">
			<div className="flex w-full max-w-4xl flex-col gap-4">
				<NavigateBack fallback="/shop" className="flex items-center gap-1 text-red">
					<ArrowLeft className="h-5 w-5" />
					Back
				</NavigateBack>
				<div className="grid gap-6 rounded-xl bg-grey-800 p-5 md:grid-cols-2">
					{images[0] ? (
						<img src={images[0]} alt={product.name} className="w-full rounded-xl object-cover" />
					) : (
						<div className="aspect-square rounded-xl bg-grey-600" />
					)}
					<div className="flex flex-col gap-5">
						<div>
							<p className="text-sm text-red">{product.community.name}</p>
							<h1 className="font-luckiest-guy text-3xl text-white">{product.name}</h1>
						</div>
						{product.description ? <TipTap content={product.description} /> : null}
					</div>
				</div>
			</div>
		</div>
	);
}
