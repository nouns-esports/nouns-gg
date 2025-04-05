import Link from "@/components/Link";
import { getAuthenticatedUser, isInServer } from "@/server/queries/users";
import SignInButton from "./SignInButton";
import {
	Shapes,
	ShoppingBag,
	ArrowRight,
	Trophy,
	Handshake,
	Gem,
	MessageCircle,
	CalendarDays,
	Settings2,
	List,
	Plus,
	ShoppingCart,
	Coins,
} from "lucide-react";
import Banner from "./Banner";
import Menu from "./Menu";
import { getNotifications } from "@/server/queries/notifications";
import Notifications from "./Notifications";
import GoldModal from "./modals/GoldModal";
import { ToggleModal } from "./Modal";
import CartModal from "./modals/CartModal";
import EnterNexusModal from "./modals/EnterNexusModal";

export default async function Header() {
	const user = await getAuthenticatedUser();

	const notifications = user ? await getNotifications({ user: user.id }) : [];

	const inServer =
		!user?.nexus?.rank && user?.discord?.subject
			? await isInServer({ subject: user.discord.subject })
			: false;

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
									<Group title="Esports" icon={<Trophy className="w-5 h-5" />}>
										<div className="flex flex-col gap-0 w-80">
											<Link
												href="/about"
												className="text-nowrap hover:bg-grey-500 transition-colors py-1.5 px-3 rounded-lg flex gap-4 items-center"
											>
												<img
													alt="Nouns logo"
													src="/logo/logo-square.png"
													className="h-10 w-10 rounded-md"
												/>
												<div>
													<p className="font-bebas-neue text-lg">About</p>
													<p className="text-grey-200">
														Learn how to get involved
													</p>
												</div>
											</Link>

											<Link
												href="/partners"
												className="text-nowrap hover:bg-grey-500 transition-colors py-1.5 px-3 rounded-lg flex gap-4 items-center"
											>
												<div className="rounded-md w-10 h-10 flex overflow-hidden bg-purple text-white items-center">
													<Handshake className="w-full h-full p-2" />
												</div>
												<div>
													<p className="font-bebas-neue text-lg">Partners</p>
													<p className="text-grey-200">Partner with us</p>
												</div>
											</Link>
											<Link
												href="/discord"
												className="text-nowrap hover:bg-grey-500 transition-colors py-1.5 px-3 rounded-lg flex gap-4 items-center"
											>
												<img
													alt="Discord logo"
													src="/discord.jpg"
													className="h-10 w-10 rounded-md"
												/>
												<div>
													<p className="font-bebas-neue text-lg">Discord</p>
													<p className="text-grey-200">
														Join the Discord server
													</p>
												</div>
											</Link>
										</div>
									</Group>
									<Group
										title="Get Involved"
										icon={<Shapes className="w-5 h-5" />}
									>
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
													href="/leaderboard"
													className="flex items-center gap-4"
												>
													<div className="rounded-md w-10 h-10 flex overflow-hidden bg-pink text-white items-center">
														<List className="w-full h-full p-2" />
													</div>
													<div>
														<p className="font-bebas-neue text-lg">
															Leaderboard
														</p>
														<p className="text-grey-200">
															Rankup and earn rewards
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
									<Link href="/events" className="max-[900px]:hidden">
										<li className="flex gap-2 items-center opacity-100 hover:opacity-80 transition-opacity relative z-[60]">
											<CalendarDays className="w-5 h-5" />
											Events
										</li>
									</Link>
									{/* <Group
										title="Events"
										icon={<CalendarDays className="w-5 h-5" />}
									>
										<ul className="flex flex-col gap-0 w-80">
											<li className="text-nowrap hover:bg-grey-500 transition-colors py-1.5 px-3 rounded-lg">
												<Link
													href="/events"
													className="flex items-center gap-4"
												>
													<div className="rounded-md w-10 h-10 flex overflow-hidden bg-green text-white items-center">
														<CalendarDays className="w-full h-full p-2" />
													</div>
													<div>
														<p className="font-bebas-neue text-lg">
															All Events
														</p>
														<p className="text-grey-200">
															View all upcoming events
														</p>
													</div>
												</Link>
											</li>
											<li className="flex h-32 py-1.5 px-3 group/event">
												<Link
													href="/events/nounsvitational"
													className="rounded-lg w-full overflow-hidden"
												>
													<img
														src="https://ipfs.nouns.gg/ipfs/QmcgHPHzUADhj846SVQahRVD9hvspStVAXt99NanE6wvrn"
														className="w-full h-full object-cover group-hover/event:scale-105 transition-transform duration-300"
													/>
												</Link>
											</li>
										</ul>
									</Group> */}
									<Link href="/shop" className="max-[900px]:hidden">
										<li className="flex gap-2 items-center opacity-100 hover:opacity-80 transition-opacity relative z-[60] [text-shadow:_0_1px_8px_rgb(0_0_0_/_40%)]">
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
											{user?.nexus?.gold
												? Number(user.nexus.gold) >= 1000
													? `${(Math.floor(Number(user.nexus.gold)) / 1000).toFixed(1)}k`
													: Number(user.nexus.gold) % 1 === 0
														? Math.floor(Number(user.nexus.gold))
														: Number(user.nexus.gold)
												: 0}
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
			{!user?.nexus?.rank ? (
				<EnterNexusModal
					linkedFarcaster={!!user?.farcaster?.fid}
					inServer={inServer}
				/>
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
