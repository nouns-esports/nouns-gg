import "./globals.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/providers";
import { siteConfig } from "@/config";
const cabin = localFont({
	src: "../public/fonts/Cabin-Regular.ttf",
	variable: "--font-cabin",
});

const luckiestGuy = localFont({
	src: "../public/fonts/LuckiestGuy-Regular.ttf",
	variable: "--font-luckiest-guy",
});

const bebasNeue = localFont({
	src: "../public/fonts/BebasNeue-Regular.ttf",
	variable: "--font-bebas-neue",
});

const londrinaSolid = localFont({
	src: "../public/fonts/LondrinaSolid-Regular.ttf",
	variable: "--font-londrina-solid",
});

export const metadata = {
	title: "Nouns",
	description: "Esports, powered by you!",
	keywords: [
		"esports",
		"nouns",
		"nounsdao",
		"web3",
		"crypto",
		"community",
		"gaming",
		"blockchain",
		"nft",
		"dao",
		"governance",
	],
	metadataBase: new URL(siteConfig.domain),
	openGraph: {
		type: "website",
		images: [
			"https://ipfs.nouns.gg/ipfs/bafybeih4hyyo6jakdqvg6xjc26pmh5kg5peqkig2wmjufzjbnum6oyb25y",
		],
	},
	twitter: {
		site: "@NounsGG",
		card: "summary_large_image",
		images: [
			"https://ipfs.nouns.gg/ipfs/bafybeih4hyyo6jakdqvg6xjc26pmh5kg5peqkig2wmjufzjbnum6oyb25y",
		],
	},
	icons: {
		apple: [
			{
				url: "/logo/logo-square.png",
				sizes: "180x180",
				type: "image/png",
			},
		],
		icon: [
			{
				url: "/logo/logo.png",
				sizes: "32x32",
				type: "image/png",
			},
			{
				url: "/logo/logo.png",
				sizes: "16x16",
				type: "image/png",
			},
		],
	},
	other: {
		"fc:frame": JSON.stringify({
			version: "next",
			imageUrl:
				"https://ipfs.nouns.gg/ipfs/bafybeigrwccl3n7cy3jizjfvy2wmvklwvono3ju7hq2lp4bcplrv6x74ua",
			button: {
				title: "Launch",
				action: {
					type: "launch_frame",
					name: "Nouns GG",
					url: siteConfig.domain,
					splashImageUrl:
						"https://ipfs.nouns.gg/ipfs/bafkreia2vysupa4ctmftg5ro73igggkq4fzgqjfjqdafntylwlnfclziey",
					splashBackgroundColor: "#040404",
				},
			},
		}),
	},
} satisfies Metadata;

export const viewport = {
	themeColor: "black",
} satisfies Viewport;

export const dynamic = "force-static";

export default async function RootLayout(props: { children: React.ReactNode }) {
	return (
		<html lang="en" className="/scroll-smooth overflow-x-hidden scrollbar-main">
			<body
				className={`${cabin.variable} ${luckiestGuy.variable} ${bebasNeue.variable} ${londrinaSolid.variable} bg-black text-grey-200 font-cabin selection:text-white selection:bg-red flex flex-col items-center w-full h-full`}
			>
				<Providers>
					<Header />
					<main className="flex flex-col w-full min-h-[calc(100vh_-_224px)] h-full">
						{props.children}
					</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
