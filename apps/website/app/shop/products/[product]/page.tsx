import AddToCartButton from "@/components/AddToCartButton";
import Link from "@/components/Link";
import { getProduct } from "@/server/queries/shop";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { env } from "~/env";
import { twMerge } from "tailwind-merge";
import { ToggleModal } from "@/components/Modal";
import { Bell, Check } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { getAuthenticatedUser } from "@/server/queries/users";
import LinkEmailModal from "@/components/modals/LinkEmailModal";
import TipTap from "@/components/TipTap";
import { parseProduct } from "@/utils/parseProduct";

export async function generateMetadata(props: {
	params: Promise<{ product: string }>;
	searchParams: Promise<{ size?: string; color?: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const searchParams = await props.searchParams;

	const product = await getProduct({ handle: params.product });

	if (!product) {
		return notFound();
	}

	const { selectedVariant, images, imageIndexFromColor } = parseProduct({
		product,
		preSelectedVariant: {
			size: searchParams.size,
			color: searchParams.color,
		},
	});

	const image = selectedVariant?.color
		? images[imageIndexFromColor[selectedVariant.color.id]]
		: images[0];

	return {
		title: product.name,
		openGraph: {
			type: "website",
			images: [image],
		},
		twitter: {
			site: "@NounsGG",
			card: "summary_large_image",
			images: [image],
		},
		other: {
			"fc:frame": JSON.stringify({
				version: "next",
				imageUrl: image,
				button: {
					title: "Buy",
					action: {
						type: "launch_frame",
						name: "Nouns GG",
						url: `${env.NEXT_PUBLIC_DOMAIN}/shop/products/${product.handle}`,
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
	searchParams: Promise<{ size?: string; color?: string }>;
}) {
	redirect("/");

	// const params = await props.params;
	// const searchParams = await props.searchParams;

	// const [user, product] = await Promise.all([
	// 	getAuthenticatedUser(),
	// 	getProduct({ handle: params.product }),
	// ]);

	// if (!product) {
	// 	return notFound();
	// }

	// const { colors, sizes, images, imageIndexFromColor, selectedVariant } =
	// 	parseProduct({
	// 		product,
	// 		preSelectedVariant: {
	// 			size: searchParams.size,
	// 			color: searchParams.color,
	// 		},
	// 	});

	// return (
	// 	<>
	// 		<div className="flex justify-center gap-4 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
	// 			<div className="flex flex-col gap-4 max-w-4xl w-full">
	// 				<div className="bg-grey-800 rounded-xl p-4 flex gap-4 max-md:gap-2 max-md:flex-col">
	// 					<ProductImage
	// 						images={images}
	// 						selectedImage={
	// 							selectedVariant.color
	// 								? imageIndexFromColor[selectedVariant.color.id]
	// 								: 0
	// 						}
	// 					/>
	// 					<div className="flex flex-col h-full gap-6 max-md:gap-2">
	// 						<h1 className="text-white text-3xl max-sm:text-2xl font-luckiest-guy">
	// 							{product.name}
	// 						</h1>
	// 						<div className="flex flex-col gap-4">
	// 							{colors.length > 1 ? (
	// 								<div className="flex flex-col gap-2">
	// 									<p className="text-white">Color</p>
	// 									<div className="flex items-center gap-1.5">
	// 										{colors.map((color) => (
	// 											<Link
	// 												href={`/shop/products/${product.handle}?color=${color.id}${selectedVariant.size ? `&size=${selectedVariant.size}` : ""}`}
	// 												key={color.id}
	// 												style={{ backgroundColor: color.hex }}
	// 												className={twMerge(
	// 													"flex items-center justify-center gap-1 w-8 h-8 rounded-md relative",
	// 													selectedVariant.color?.id === color.id &&
	// 														"border-gold-500 border-2",
	// 												)}
	// 											/>
	// 										))}
	// 									</div>
	// 								</div>
	// 							) : null}
	// 							{sizes.length > 1 ? (
	// 								<div className="flex flex-col gap-2">
	// 									<p className="text-white">Size</p>
	// 									<div className="flex items-center gap-1.5">
	// 										{sizes
	// 											.sort((a, b) => {
	// 												const order = [
	// 													"xs",
	// 													"s",
	// 													"m",
	// 													"l",
	// 													"xl",
	// 													"2xl",
	// 													"3xl",
	// 													"4xl",
	// 													"5xl",
	// 												];
	// 												return order.indexOf(a) - order.indexOf(b);
	// 											})
	// 											.map((size) => (
	// 												<Link
	// 													href={`/shop/products/${product.handle}?size=${size}${selectedVariant.color ? `&color=${selectedVariant.color.id}` : ""}`}
	// 													key={size}
	// 													className={twMerge(
	// 														"flex items-center justify-center gap-1 w-8 h-8 text-sm text-grey-200 rounded-md border border-white/10 relative",
	// 														selectedVariant.size === size && "bg-white/10",
	// 													)}
	// 												>
	// 													{size.toUpperCase()}
	// 												</Link>
	// 											))}
	// 									</div>
	// 								</div>
	// 							) : null}
	// 						</div>
	// 						<div className="flex flex-col gap-4">
	// 							<div className="flex gap-4 items-center">
	// 								<AddToCartButton
	// 									active={product.active}
	// 									inventory={selectedVariant.inventory ?? Infinity}
	// 									product={product.id}
	// 									variant={selectedVariant.id}
	// 									image={
	// 										selectedVariant.color
	// 											? images[imageIndexFromColor[selectedVariant.color.id]]
	// 											: images[0]
	// 									}
	// 									name={product.name}
	// 								/>
	// 								<div className="flex gap-2.5 items-center">
	// 									<p className="text-white text-lg">
	// 										${selectedVariant.price.toFixed(2)}
	// 									</p>
	// 									<div className="w-0.5 h-5 bg-grey-500 rounded-full" />
	// 									<div className="flex items-center gap-1.5">
	// 										<img
	// 											src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
	// 											alt="Gold"
	// 											className="w-5 h-5"
	// 										/>
	// 										<p className="text-[#FEBD1C] text-lg font-semibold">
	// 											{(selectedVariant.price * 100)
	// 												.toFixed(0)
	// 												.toLocaleString()}
	// 										</p>
	// 									</div>
	// 								</div>
	// 							</div>
	// 							<div className="flex items-center gap-2">
	// 								{(selectedVariant.inventory !== null &&
	// 									selectedVariant.inventory < 1) ||
	// 								!product.active ? (
	// 									<ToggleModal
	// 										id="link-email"
	// 										disabled={user?.nexus?.canRecieveEmails}
	// 										className={twMerge(
	// 											"flex items-center gap-1",
	// 											user?.nexus?.canRecieveEmails
	// 												? "text-green"
	// 												: "text-red hover:text-red/70 transition-colors",
	// 										)}
	// 									>
	// 										{user?.nexus?.canRecieveEmails ? (
	// 											<Check className="w-4 h-4" />
	// 										) : (
	// 											<Bell className="w-4 h-4" />
	// 										)}
	// 										{user?.nexus?.canRecieveEmails
	// 											? "Email notifications on"
	// 											: "Notify me for changes or future drops"}
	// 									</ToggleModal>
	// 								) : null}
	// 							</div>
	// 						</div>
	// 					</div>
	// 				</div>
	// 				{product.description ? (
	// 					<div className="bg-grey-800 rounded-xl p-4 flex flex-col gap-4 pl-5">
	// 						<p className="text-white font-bebas-neue text-2xl">Details</p>
	// 						{product.description ? (
	// 							<TipTap content={product.description} />
	// 						) : null}
	// 					</div>
	// 				) : null}
	// 			</div>
	// 		</div>
	// 		{!user?.email?.address || !user?.nexus?.canRecieveEmails ? (
	// 			<LinkEmailModal hasEmail={!!user?.email?.address} />
	// 		) : null}
	// 	</>
	// );
}
