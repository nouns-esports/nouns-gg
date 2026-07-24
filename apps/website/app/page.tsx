import Link from "@/components/Link";
import Gallery from "@/components/Gallery";
import { ArrowRight } from "lucide-react";
import { getRounds } from "@/server/queries/rounds";
import { getCommunities } from "@/server/queries/communities";
import { getQuests } from "@/server/queries/quests";
import { siteConfig } from "@/config";
import type { Metadata } from "next";
import RoundCard from "@/components/RoundCard";
import QuestCard from "@/components/QuestCard";

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

export default async function Home() {
	const [rounds, communities, quests] = await Promise.all([
		getRounds({ limit: 4 }),
		getCommunities({ featured: true, limit: 4 }),
		getQuests({ limit: 4 }),
	]);

	return (
		<div className="flex w-full flex-col items-center">
			<div className="flex w-full max-w-[1920px] flex-col gap-12 px-32 pb-16 pt-32 max-2xl:px-16 max-xl:px-8 max-xl:pt-28 max-sm:gap-8 max-sm:px-4 max-sm:pt-20">
				<section className="w-full">
					<Gallery />
				</section>
				<section>
					<SectionTitle title="Communities" href="/communities" />
					<div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
						{communities.map((community) => (
							<Link
								key={community.id}
								href={`/c/${community.handle}`}
								className="flex items-center gap-3 rounded-xl bg-grey-800 p-4 transition-colors hover:bg-grey-600"
							>
								<img src={community.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
								<div>
									<h3 className="font-bebas-neue text-xl text-white">{community.name}</h3>
									<p className="line-clamp-1 text-sm text-grey-200">View community</p>
								</div>
							</Link>
						))}
					</div>
				</section>
				{rounds.length ? (
					<section>
						<SectionTitle title="Rounds" href="/rounds" />
						<div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
							{rounds.map((round) => <RoundCard key={round.id} round={round} />)}
						</div>
					</section>
				) : null}
				{quests.length ? (
					<section>
						<SectionTitle title="Quests" href="/quests" />
						<div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
							{quests.map((quest) => <QuestCard key={quest.id} quest={quest} />)}
						</div>
					</section>
				) : null}
			</div>
		</div>
	);
}

function SectionTitle(props: { title: string; href: string }) {
	return (
		<div className="mb-4 flex items-center justify-between">
			<h2 className="font-luckiest-guy text-3xl text-white">{props.title}</h2>
			<Link href={props.href} className="flex items-center gap-1 text-red">
				View all <ArrowRight className="h-4 w-4" />
			</Link>
		</div>
	);
}
