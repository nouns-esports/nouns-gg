import Link from "@/components/Link";
import { getAuthenticatedUser } from "@/server/queries/users";
import SignInButton from "./SignInButton";
import {
	Shapes,
	ShoppingBag,
	Trophy,
	Gem,
	CalendarDays,
	List,
	ShoppingCart,
	Coins,
	Users,
	ArrowRight,
} from "lucide-react";
import Banner from "./Banner";
import Menu from "./Menu";
import { getNotifications } from "@/server/queries/notifications";
import Notifications from "./Notifications";
import GoldModal from "./modals/GoldModal";
import { ToggleModal } from "./Modal";
import CartModal from "./modals/CartModal";
import { formatGold } from "~/packages/utils/formatGold";
import { getCommunities } from "@/server/queries/communities";

export default async function Header() {
	const user = await getAuthenticatedUser();
	const [communities, notifications] = await Promise.all([
		getCommunities(),
		user ? getNotifications({ user: user.id }) : [],
	]);

	return (
		<>
			<Banner />
			<header className="sticky top-0 w-full z-[60] flex justify-center">
				<div className="relative w-full max-w-[1920px]">
					<div className="pointer-events-none absolute top-0 w-full flex items-center justify-between px-16 h-32 max-xl:h-28 max-xl:px-8 max-sm:px-4 max-sm:h-20 z-40">
						<div className="flex gap-8 max-sm:gap-4 items-center">
							<Link
								href="/"
								className="pointer-events-auto flex gap-4 h-[2.85rem] max-sm:h-10 max-sm:gap-3 group items-center cursor-pointer select-none"
							>
								<img
									alt="Nouns logo"
									src="https://ipfs.nouns.gg/ipfs/bafkreiadperyf6dbqxgbcff75ux3w6wq2vrit5hghqrnvyyo3ypv5mgtja"
									draggable={false}
									className="group-hover:rotate-[14deg] h-full transition-transform duration-150 select-none relative z-[60]"
								/>
							</Link>
							<nav className="pointer-events-auto flex items-center gap-8">
								<Menu />
								<ul className="flex gap-6 items-center text-white max-md:gap-0">
									<Group title="Explore" icon={<Shapes className="w-5 h-5" />}>
										<ul className="flex flex-col gap-0 w-80">
											<li className="text-nowrap hover:bg-grey-500 transition-colors py-1.5 px-3 rounded-lg">
												<Link
													href="/rounds"
													className="flex gap-4 items-center"
												>
													<div className="rounded-md w-10 h-10 flex overflow-hidden bg-green text-white items-center">
														<Trophy className="w-full h-full p-2" />
													</div>
													<div>
														<p className="font-bebas-neue text-lg">Rounds</p>
														<p className="text-grey-200">
															Govern who and what we fund
														</p>
													</div>
												</Link>
											</li>
											<li className="text-nowrap hover:bg-grey-500 transition-colors py-1.5 px-3 rounded-lg">
												<Link
													href="/quests"
													className="flex gap-4 items-center"
												>
													<div className="rounded-md w-10 h-10 flex overflow-hidden bg-blue-500 text-white items-center">
														<Gem className="w-full h-full p-2" />
													</div>
													<div>
														<p className="font-bebas-neue text-lg">Quests</p>
														<p className="text-grey-200">Level up your Nexus</p>
													</div>
												</Link>
											</li>
											<li className="text-nowrap hover:bg-grey-500 transition-colors py-1.5 px-3 rounded-lg">
												<Link
													href="/events"
													className="flex items-center gap-4"
												>
													<div className="rounded-md w-10 h-10 flex overflow-hidden bg-pink text-white items-center">
														<CalendarDays className="w-full h-full p-2" />
													</div>
													<div>
														<p className="font-bebas-neue text-lg">Events</p>
														<p className="text-grey-200">
															Check out upcoming events
														</p>
													</div>
												</Link>
											</li>
											<li className="text-nowrap hover:bg-grey-500 transition-colors py-1.5 px-3 rounded-lg">
												<Link
													href="/predictions"
													className="flex items-center gap-4"
												>
													<div className="rounded-md w-10 h-10 flex overflow-hidden bg-gold-500 text-white items-center">
														<Coins className="w-full h-full p-2" />
													</div>
													<div>
														<p className="font-bebas-neue text-lg">
															Predictions
														</p>
														<p className="text-grey-200">
															Make predictions and earn gold
														</p>
													</div>
												</Link>
											</li>
										</ul>
									</Group>
									<Group
										title="Communities"
										icon={<Users className="w-5 h-5" />}
									>
										<div className="flex flex-col gap-2">
											<div className="grid grid-cols-2 gap-2 w-80">
												{communities.map((community) => (
													<Link
														href={`/c/${community.handle}`}
														key={community.id}
														className="flex gap-2 items-center text-nowrap group/c hover:bg-grey-500 transition-colors rounded-lg p-2"
													>
														<img
															src={community.image}
															alt={community.name}
															className="w-6 h-6 rounded-md"
														/>
														<p className="text-nowrap group-hover/c:text-white/70 transition-colors">
															{community.name}
														</p>
													</Link>
												))}
											</div>
											<Link
												href="/communities"
												className="text-red gap-1.5 pl-2 flex items-center group/view-all transition-colors hover:text-red/70"
											>
												View All
												<ArrowRight className="w-4 h-4 group-hover/view-all:translate-x-1 transition-transform" />
											</Link>
										</div>
									</Group>
									<Link href="/shop" className="max-[900px]:hidden">
										<li className="flex gap-2 items-center opacity-100 hover:opacity-80 transition-opacity relative z-[60]">
											<ShoppingBag className="w-5 h-5" />
											Shop
										</li>
									</Link>
								</ul>
							</nav>
						</div>
						<div className="pointer-events-auto flex gap-6 max-[425px]:gap-4 items-center relative z-[60]">
							<div className="flex items-center gap-4 max-[425px]:gap-2">
								<Notifications notifications={notifications} />
								<ToggleModal id="cart">
									<ShoppingCart className="w-[22px] h-[22px] text-white hover:text-grey-200 transition-colors" />
								</ToggleModal>
							</div>
							<div className="flex items-center bg-[#4F3101] has-[.child:hover]:bg-[#623C00] transition-colors rounded-full cursor-pointer">
								{user?.nexus ? (
									<ToggleModal
										id="gold"
										className="child pl-3 pr-4 max-[425px]:pr-2 h-10 flex gap-1.5 items-center justify-center"
									>
										<img
											alt="Gold coin"
											src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
											className="rounded-full h-5 w-5 shadow-xl select-none"
											draggable={false}
										/>
										<p className="font-semibold text-[#FEBD1C] select-none">
											{formatGold(Number(user.nexus.gold ?? 0))}
										</p>
									</ToggleModal>
								) : null}
								<SignInButton user={user} />
							</div>
						</div>
					</div>
				</div>
			</header>
			{user ? <GoldModal user={user} /> : null}
			{user?.nexus?.carts ? (
				<CartModal user={user.id} cart={user.nexus.carts} />
			) : null}
		</>
	);
}

function Group(props: {
	title: string;
	children: React.ReactNode;
	icon: React.ReactNode;
}) {
	return (
		<li className="relative group flex">
			<div className="cursor-pointer opacity-100 hover:opacity-80 transition-opacity font-semibold flex justify-center gap-2 items-center max-[900px]:hidden [text-shadow:_0_1px_8px_rgb(0_0_0_/_4%)]">
				{props.icon}
				{props.title}
			</div>
			<div className="absolute top-6 -left-8 pt-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto max-[900px]:hidden">
				<div className="bg-grey-600 rounded-xl p-3 flex gap-2">
					{props.children}
				</div>
			</div>
		</li>
	);
}
