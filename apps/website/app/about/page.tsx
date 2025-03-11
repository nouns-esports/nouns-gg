import Link from "@/components/Link";

export default function AboutPage() {
	return (
		<div className="flex flex-col items-center h-full pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
			<div className="flex flex-col items-center gap-8 max-w-2xl">
				<img
					src="https://ipfs.nouns.gg/ipfs/bafybeiarnst2uvayawr3zs7mzzuvdzogjvwv5nbucwq4du3zhypcojotzu"
					className="w-full rounded-xl"
				/>
				<div className="flex flex-col items-center gap-4">
					<h1 className="font-luckiest-guy text-white text-3xl">
						Welcome to Nouns
					</h1>
					<p className="text-center">
						We're a community-driven project that fosters creativity,
						collaboration, and fun. As a decentralized autonomous organization
						(DAO), we use unique digital art pieces, called Nouns, as membership
						tokens. These tokens give holders voting power and exclusive access
						to rewards. Our mission is to build the largest decentralized brand,
						where everyone who represents us feels like a valued part of our
						flourishing ecosystem.
					</p>
				</div>

				<div className="flex flex-col items-center gap-4">
					<h2 className="font-luckiest-guy text-white text-3xl">
						What is Nouns GG?
					</h2>
					<p className="text-center">
						Nouns GG is an initiative within the Nouns ecosystem that aims to
						bring the excitement of competitive gaming to a wider audience. By
						sponsoring events, teams, and players across various games, we seek
						to amplify the brand and showcase the creativity and skill of our
						community members.
					</p>
					<p className="text-center">
						Through Esports, we're building a platform that combines the thrill
						of competition with the values of collaboration and mutual support.
						Whether you're a seasoned gamer or just starting out, we invite you
						to join us on this exciting journey.
					</p>
				</div>

				<div className="flex flex-col items-center gap-4">
					<h2 className="font-luckiest-guy text-white text-3xl">
						Getting Started
					</h2>
					<p className="text-center">
						Ready to dive into the world of Nouns GG & NounsDAO? Here's how you
						can get started:
					</p>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2 bg-grey-800 rounded-xl p-4">
						<div className="flex justify-between items-center">
							<h3 className="text-white font-bebas-neue text-2xl">
								Participate on Nouns.GG
							</h3>
							<Link href="/nexus" className="text-red">
								Enter the Nexus
							</Link>
						</div>
						<p className="text-grey-200">
							Complete quests and achieve milestones, vote on rounds, and level
							up your account to improve your position on the Nouns GG
							Leaderboard.
						</p>
					</div>
					<div className="flex flex-col gap-2 bg-grey-800 rounded-xl p-4">
						<div className="flex justify-between items-center">
							<h3 className="text-white font-bebas-neue text-2xl">
								Create a wallet
							</h3>
							<Link newTab href="/rainbow" className="text-red">
								Get Started
							</Link>
						</div>
						<p className="text-grey-200">
							To participate in the ecosystem, you'll need a cryptocurrency
							wallet. This will allow you to store, send, and receive tokens as
							well as interact with other members of the community.
						</p>
					</div>
					<div className="flex flex-col gap-2 bg-grey-800 rounded-xl p-4">
						<div className="flex justify-between items-center">
							<h3 className="text-white font-bebas-neue text-2xl">
								Participate on Warpcast
							</h3>
							<Link
								href="https://warpcast.com/~/channel/nouns-esports"
								className="text-red"
								newTab
							>
								Visit Warpcast
							</Link>
						</div>
						<p className="text-grey-200">
							Warpcast is our real-time engagement platform where members can
							connect with each other, share ideas, and stay up-to-date on
							latest developments within the ecosystem.
						</p>
					</div>
					<div className="flex flex-col gap-2 bg-grey-800 rounded-xl p-4">
						<div className="flex justify-between items-center">
							<h3 className="text-white font-bebas-neue text-2xl">
								Join Flows
							</h3>
							<Link href="https://flows.wtf" newTab className="text-red mr-2">
								Visit Flows
							</Link>
						</div>
						<p className="text-grey-200">
							Flows are community-driven projects that bring people together
							around shared interests and ideas. By joining Flows, you can
							connect with like-minded individuals, contribute to exciting
							initiatives, and help shape the future of the ecosystem.
						</p>
					</div>
					<div className="flex flex-col gap-2 bg-grey-800 rounded-xl p-4">
						<div className="flex justify-between items-center">
							<h3 className="text-white font-bebas-neue text-2xl">
								Buy a Noun
							</h3>
							<Link href="https://nouns.wtf" newTab className="text-red">
								Visit nouns.wtf
							</Link>
						</div>
						<p className="text-grey-200">
							Acquiring a Noun is your key to joining the community, granting
							you access to exclusive events, opportunities for collaboration,
							and decision-making processes within the DAO.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
