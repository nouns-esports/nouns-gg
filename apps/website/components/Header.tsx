import Link from "@/components/Link";
import { getCommunities } from "@/server/queries/communities";
import {
	ArrowRight,
	CalendarDays,
	Coins,
	Gem,
	Shapes,
	Trophy,
	Users,
} from "lucide-react";
import Banner from "./Banner";
import Menu from "./Menu";

export default async function Header() {
	const communities = await getCommunities({ featured: true });

	return (
		<>
			<Banner />
			<header className="sticky top-0 z-[60] flex w-full justify-center">
				<div className="relative w-full max-w-[1920px]">
					<div className="pointer-events-none absolute top-0 z-40 flex h-32 w-full items-center justify-between px-16 max-xl:h-28 max-xl:px-8 max-sm:h-20 max-sm:px-4">
						<div className="flex items-center gap-8 max-sm:gap-4">
							<Link
								href="/"
								className="pointer-events-auto group flex h-[2.85rem] items-center gap-4 max-sm:h-10 max-sm:gap-3"
							>
								<img
									alt="Nouns logo"
									src="https://ipfs.nouns.gg/ipfs/bafkreiadperyf6dbqxgbcff75ux3w6wq2vrit5hghqrnvyyo3ypv5mgtja"
									draggable={false}
									className="relative z-[60] h-full select-none transition-transform duration-150 group-hover:rotate-[14deg]"
								/>
							</Link>
							<nav className="pointer-events-auto flex items-center gap-8">
								<Menu />
								<ul className="flex items-center gap-6 text-white max-md:gap-0">
									<Group title="Explore" icon={<Shapes className="h-5 w-5" />}>
										<ul className="flex w-80 flex-col">
											<ExploreItem
												href="/rounds"
												icon={<Trophy className="h-full w-full p-2" />}
												color="bg-green"
												title="Rounds"
												description="Govern who and what we fund"
											/>
											<ExploreItem
												href="/quests"
												icon={<Gem className="h-full w-full p-2" />}
												color="bg-blue-500"
												title="Quests"
												description="Level up your Nexus"
											/>
											<ExploreItem
												href="/events"
												icon={<CalendarDays className="h-full w-full p-2" />}
												color="bg-pink"
												title="Events"
												description="Check out upcoming events"
											/>
											<ExploreItem
												href="/predictions"
												icon={<Coins className="h-full w-full p-2" />}
												color="bg-gold-500"
												title="Predictions"
												description="Make predictions and earn gold"
											/>
										</ul>
									</Group>
									<Group title="Communities" icon={<Users className="h-5 w-5" />}>
										<div className="flex flex-col gap-2">
											<div className="grid w-80 grid-cols-2">
												{communities.map((community) => (
													<Link
														href={`/c/${community.handle}`}
														key={community.id}
														className="group/c flex items-center gap-2 text-nowrap rounded-lg p-2 transition-colors hover:bg-grey-500"
													>
														<img
															src={community.image}
															alt={community.name}
															className="h-6 w-6 rounded-md object-cover"
														/>
														<p className="text-nowrap transition-colors group-hover/c:text-white/70">
															{community.name}
														</p>
													</Link>
												))}
											</div>
											<Link
												href="/communities"
												className="group/view-all flex items-center gap-1.5 pl-2 text-red transition-colors hover:text-red/70"
											>
												View All
												<ArrowRight className="h-4 w-4 transition-transform group-hover/view-all:translate-x-1" />
											</Link>
										</div>
									</Group>
								</ul>
							</nav>
						</div>
					</div>
				</div>
			</header>
		</>
	);
}

function ExploreItem(props: {
	href: string;
	icon: React.ReactNode;
	color: string;
	title: string;
	description: string;
}) {
	return (
		<li className="text-nowrap rounded-lg px-3 py-1.5 transition-colors hover:bg-grey-500">
			<Link href={props.href} className="flex items-center gap-4">
				<div
					className={`flex h-10 w-10 items-center overflow-hidden rounded-md text-white ${props.color}`}
				>
					{props.icon}
				</div>
				<div>
					<p className="font-bebas-neue text-lg">{props.title}</p>
					<p className="text-grey-200">{props.description}</p>
				</div>
			</Link>
		</li>
	);
}

function Group(props: {
	title: string;
	children: React.ReactNode;
	icon: React.ReactNode;
}) {
	return (
		<li className="group relative flex">
			<div className="flex cursor-pointer items-center justify-center gap-2 font-semibold opacity-100 transition-opacity hover:opacity-80 max-[900px]:hidden">
				{props.icon}
				{props.title}
			</div>
			<div className="pointer-events-none absolute -left-8 top-6 pt-4 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 max-[900px]:hidden">
				<div className="flex gap-2 rounded-xl bg-grey-600 p-3">
					{props.children}
				</div>
			</div>
		</li>
	);
}
