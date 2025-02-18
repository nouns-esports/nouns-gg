import Button from "@/components/Button";
import Link from "@/components/Link";
import { ToggleModal } from "@/components/Modal";
import ProductCard from "@/components/ProductCard";
import { getAuthenticatedUser } from "@/server/queries/users";
import { getCollections, getProducts } from "@/server/queries/shop";
import { twMerge } from "tailwind-merge";
import type { Metadata } from "next";
import { env } from "~/env";

export async function generateMetadata(): Promise<Metadata> {
	return {
		openGraph: {
			type: "website",
			images: [
				"https://ipfs.nouns.gg/ipfs/bafybeiedicqfqhqxh52rl6kgh5oniibfm73bgx6ihcjn45vpm3tl2eprqm",
			],
		},
		twitter: {
			site: "@NounsGG",
			card: "summary_large_image",
			images: [
				"https://ipfs.nouns.gg/ipfs/bafybeiedicqfqhqxh52rl6kgh5oniibfm73bgx6ihcjn45vpm3tl2eprqm",
			],
		},
		other: {
			"fc:frame": JSON.stringify({
				version: "next",
				imageUrl:
					"https://ipfs.nouns.gg/ipfs/bafybeiedicqfqhqxh52rl6kgh5oniibfm73bgx6ihcjn45vpm3tl2eprqm",
				button: {
					title: "Shop",
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

export default async function Shop(props: {
	searchParams: Promise<{ collection?: string }>;
}) {
	const searchParams = await props.searchParams;

	const [user, products, collections] = await Promise.all([
		getAuthenticatedUser(),
		getProducts({ collection: searchParams.collection }),
		getCollections(),
	]);

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
							<h2 className="text-4xl text-white font-luckiest-guy max-md:text-3xl">
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
				<div className="flex flex-col gap-6">
					<div className="flex justify-between items-center">
						<h1 className="text-white font-luckiest-guy text-4xl">Products</h1>
						{user?.nexus ? (
							<ToggleModal id="cart" className="max-sm:flex hidden">
								<Button>View Cart</Button>
							</ToggleModal>
						) : (
							<ToggleModal id="sign-in" className="max-sm:flex hidden">
								<Button>Sign in</Button>
							</ToggleModal>
						)}
					</div>

					<div className="flex justify-between items-center">
						<ul className="flex gap-2 w-full max-sm:overflow-x-auto">
							<CategoryTag selected={!searchParams.collection}>All</CategoryTag>
							{collections.map((collection) => (
								<CategoryTag
									key={collection.id}
									id={collection.id}
									selected={searchParams.collection === collection.id}
									new={collection.id === "dopamine"}
								>
									{collection.name}
								</CategoryTag>
							))}
						</ul>
						{user?.nexus ? (
							<ToggleModal id="cart" className="max-sm:hidden">
								<Button>View Cart</Button>
							</ToggleModal>
						) : (
							<ToggleModal id="sign-in" className="max-sm:hidden">
								<Button>Sign in</Button>
							</ToggleModal>
						)}
					</div>

					<div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
						{products
							.toSorted((a, b) => a.name.localeCompare(b.name))
							.map((product) => (
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
	new?: boolean;
}) {
	return (
		<li
			className={twMerge(
				"bg-grey-800 text-grey-200 rounded-md px-3 py-1 font-semibold hover:bg-grey-600 hover:text-white transition-colors whitespace-nowrap",
				props.selected ? "text-white bg-grey-600" : "",
			)}
		>
			<Link
				href={`/shop${props.id ? `?collection=${props.id}` : ""}`}
				scroll={false}
				className="flex items-center gap-2"
			>
				{props.children}
				{props.new ? (
					<small className="text-white bg-red px-1 rounded-md">New</small>
				) : null}
			</Link>
		</li>
	);
}
