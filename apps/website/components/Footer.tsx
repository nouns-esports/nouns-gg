import Link from "@/components/Link";
import {
	TwitterLogo,
	YoutubeLogo,
	DiscordLogo,
	InstagramLogo,
} from "phosphor-react-sc";
import ANounsThing from "@/components/ANounsThing";

export default async function Footer() {
	return (
		<footer className="flex justify-center w-full mt-8 relative z-10">
			<div className="flex max-w-[1920px] w-full max-lg:flex-col gap-16 justify-between items-center py-8 px-16">
				<div className="flex flex-col gap-8 max-lg:items-center">
					<div className="flex flex-col gap-4">
						<Link
							href=""
							className="flex gap-3 group max-lg:justify-center items-center cursor-pointer select-none"
						>
							<img
								alt="Nouns logo"
								src="https://ipfs.nouns.gg/ipfs/bafkreiadperyf6dbqxgbcff75ux3w6wq2vrit5hghqrnvyyo3ypv5mgtja"
								draggable={false}
								className="group-hover:rotate-[14deg] w-10 transition-transform duration-150 select-none"
							/>
							<p className="text-white font-luckiest-guy text-3xl select-none">
								Nouns
							</p>
						</Link>
						<p className="w-64 max-lg:text-center max-xl:w-48 max-lg:w-64">
							Empower your community
						</p>
					</div>
					<ANounsThing />
				</div>
				<div className="flex gap-40 max-2xl:gap-20 max-[500px]:flex-col max-[500px]:gap-8">
					<Group title="Explore">
						<Item href="/rounds">Rounds</Item>
						<Item href="/quests">Quests</Item>
						<Item href="/discord">Events</Item>
					</Group>
					<Group title="Resources">
						<Item href="/privacy" newTab>
							Privacy Policy
						</Item>
						<Item href="/terms" newTab>
							Terms of Service
						</Item>
						<Item href="/github" newTab>
							GitHub
						</Item>
					</Group>
				</div>
				<div className="flex max-lg:flex-row max-[300px]:flex-col gap-4 items-center justify-center text-white">
					<div className="flex flex-col gap-4 max-lg:flex-row">
						<Link href="/discord">
							<DiscordLogo
								className="w-7 h-7 text-white hover:text-white/60 cursor-pointer transition-colors"
								weight="fill"
							/>
						</Link>
						<Link href="/instagram">
							<InstagramLogo
								className="w-7 h-7 text-white hover:text-white/60 cursor-pointer transition-colors"
								weight="fill"
							/>
						</Link>
						<Link href="/twitter">
							<TwitterLogo
								className="w-7 h-7 text-white hover:text-white/60 cursor-pointer transition-colors"
								weight="fill"
							/>
						</Link>
						<Link href="/youtube">
							<YoutubeLogo
								className="w-7 h-7 text-white hover:text-white/60 cursor-pointer transition-colors"
								weight="fill"
							/>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

function Group(props: { title: React.ReactNode; children: React.ReactNode }) {
	return (
		<div className="flex flex-col max-[500px]:items-center gap-2">
			<h3 className="text-2xl font-bebas-neue text-white max-lg:text-center">
				{props.title}
			</h3>
			<div className="flex flex-col gap-2 max-[500px]:flex-row max-[500px]:gap-6">
				{props.children}
			</div>
		</div>
	);
}

function Item(props: {
	href: string;
	children: React.ReactNode;
	newTab?: boolean;
}) {
	return (
		<Link
			href={props.href}
			newTab={props.newTab}
			className="hover:text-white select-none transition-colors max-lg:text-center text-nowrap"
		>
			{props.children}
		</Link>
	);
}
