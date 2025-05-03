import "./globals.css";
import type { Metadata, Viewport } from "next";
import {
	Cabin,
	Luckiest_Guy,
	Bebas_Neue,
	Londrina_Solid,
	Archivo_Black,
	Koulen,
	Tilt_Warp,
	Dela_Gothic_One,
} from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/providers";
import { getAuthenticatedUser } from "@/server/queries/users";
import Script from "next/script";
import { env } from "~/env";
import dynamic from "next/dynamic";

const cabin = Cabin({ subsets: ["latin"], variable: "--font-cabin" });

const luckiestGuy = Luckiest_Guy({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-luckiest-guy",
});

const bebasNeue = Bebas_Neue({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-bebas-neue",
});

const londrinaSolid = Londrina_Solid({
	subsets: ["latin"],
	weight: "400",
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
	metadataBase: new URL(env.NEXT_PUBLIC_DOMAIN),
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
					url: env.NEXT_PUBLIC_DOMAIN,
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

const CapturePageView = dynamic(() => import("@/components/CapturePageView"), {
	ssr: false,
});

export default async function RootLayout(props: { children: React.ReactNode }) {
	const user = await getAuthenticatedUser();

	const maintenance = false;

	return (
		<html lang="en" className="/scroll-smooth overflow-x-hidden scrollbar-main">
			<body
				className={`${cabin.variable} ${luckiestGuy.variable} ${bebasNeue.variable} ${londrinaSolid.variable} bg-black text-grey-200 font-cabin selection:text-white selection:bg-red flex flex-col items-center w-full h-full`}
			>
				<Providers user={user?.id}>
					{maintenance && user?.id !== "did:privy:clx8g9mui0c1k10947grzks2a" ? (
						<div className="flex flex-col gap-8 items-center w-full h-screen">
							<div className="flex flex-col gap-4 items-center justify-center w-full h-full">
								<h1 className="text-4xl text-white font-bebas-neue text-center">
									Nouns GG is currently under maintenance
								</h1>
								<p className="text-lg text-grey-200 text-center">
									We will be back soon!
								</p>
							</div>
							<img
								src="https://ipfs.nouns.gg/ipfs/bafkreic6tpk6dpz5pdscrfnusx4zhubsgjk3pmaew5kczk3tg7nxbinarm"
								alt="Site under maintenance"
								className="w-[20vw] max-w-md max-sm:w-[50vw]"
							/>
						</div>
					) : (
						<>
							<Header />
							<main className="flex flex-col w-full min-h-[calc(100vh_-_224px)] h-full">
								{props.children}
							</main>
							<Footer />
						</>
					)}
				</Providers>
			</body>
			{env.NEXT_PUBLIC_ENVIRONMENT === "production" ? (
				<Script
					defer
					src="https://cloud.umami.is/script.js"
					data-website-id="114c634e-5845-4e09-9653-7df37301aed9"
				/>
			) : (
				""
			)}
			<CapturePageView />
		</html>
	);
}
