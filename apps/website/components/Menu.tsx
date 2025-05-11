"use client";

import {
	CalendarDays,
	Coins,
	Diamond,
	Gem,
	Handshake,
	List,
	Shapes,
	ShoppingBag,
	Trophy,
	Users,
	X,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Link from "./Link";
import {
	DiscordLogo,
	InstagramLogo,
	TwitterLogo,
	YoutubeLogo,
} from "phosphor-react-sc";

export default function Menu() {
	const [mounted, setMounted] = useState(false);
	const [open, setOpen] = useState(false);

	const pathname = usePathname();
	const params = useParams();

	useEffect(() => {
		if (mounted) {
			toggleMenu(false);
		}

		setMounted(true);
	}, [params, pathname]);

	function toggleMenu(open: boolean) {
		if (open) {
			document.documentElement.classList.add(
				"overflow-y-hidden",
				"scrollbar-hidden",
			);
		} else {
			document.documentElement.classList.remove(
				"overflow-y-hidden",
				"scrollbar-hidden",
			);
		}

		setOpen(open);
	}

	return (
		<>
			{open ? (
				<X
					onClick={() => toggleMenu(false)}
					className="w-6 h-6 text-white relative z-[60]"
				/>
			) : (
				<img
					onClick={() => toggleMenu(true)}
					src="/menu.svg"
					alt=""
					className="w-6 h-6 hidden max-[900px]:flex relative z-[60]"
				/>
			)}
			<div
				className={twMerge(
					"flex flex-col gap-8 pt-24 px-8 text-grey-200 fixed w-full h-[100dvh] overflow-y-scroll bg-black top-0 left-0 pointer-events-none opacity-0 transition-opacity",
					open && "opacity-100 pointer-events-auto",
					pathname === "/" && "pt-32",
				)}
			>
				<ul className="flex flex-col gap-2">
					<li className="text-nowrap">
						<Link href="/rounds" className="flex gap-4 items-center">
							<div className="rounded-md w-10 h-10 flex overflow-hidden bg-green text-white items-center">
								<Trophy className="w-full h-full p-2" />
							</div>
							<div>
								<p className="font-bebas-neue text-lg text-white">Rounds</p>
								<p className="text-grey-200">Govern who and what we fund</p>
							</div>
						</Link>
					</li>
					<li className="text-nowrap">
						<Link href="/quests" className="flex gap-4 items-center">
							<div className="rounded-md w-10 h-10 flex overflow-hidden bg-blue-500 text-white items-center">
								<Gem className="w-full h-full p-2" />
							</div>
							<div>
								<p className="font-bebas-neue text-lg text-white">Quests</p>
								<p className="text-grey-200">Level up your nexus</p>
							</div>
						</Link>
					</li>
					<li className="text-nowrap">
						<Link href="/events" className="flex gap-4 items-center">
							<div className="rounded-md w-10 h-10 flex overflow-hidden bg-red text-white items-center">
								<CalendarDays className="w-full h-full p-2" />
							</div>
							<div>
								<p className="font-bebas-neue text-lg text-white">Events</p>
								<p className="text-grey-200">View upcoming events</p>
							</div>
						</Link>
					</li>
					<li className="text-nowrap">
						<Link href="/communities" className="flex gap-4 items-center">
							<div className="rounded-md w-10 h-10 flex overflow-hidden bg-pink text-white items-center">
								<Users className="w-full h-full p-2" />
							</div>
							<div>
								<p className="font-bebas-neue text-lg text-white">
									Communities
								</p>
								<p className="text-grey-200">Explore communities</p>
							</div>
						</Link>
					</li>
					<li className="text-nowrap">
						<Link href="/predictions" className="flex gap-4 items-center">
							<div className="rounded-md w-10 h-10 flex overflow-hidden bg-purple text-white items-center">
								<Coins className="w-full h-full p-2" />
							</div>
							<div>
								<p className="font-bebas-neue text-lg text-white">
									Predictions
								</p>
								<p className="text-grey-200">Place bets and earn gold</p>
							</div>
						</Link>
					</li>
					<li className="text-nowrap">
						<Link href="/shop" className="flex gap-4 items-center">
							<div className="rounded-md w-10 h-10 flex overflow-hidden bg-gold-500 text-white items-center">
								<ShoppingBag className="w-full h-full p-2" />
							</div>
							<div>
								<p className="font-bebas-neue text-lg text-white">Shop</p>
								<p className="text-grey-200">Spend your gold</p>
							</div>
						</Link>
					</li>
				</ul>

				<div className="flex items-center gap-4 w-full h-full justify-center">
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
		</>
	);
}

function Group(props: {
	title: string;
	children: React.ReactNode;
	icon: React.ReactNode;
}) {
	return (
		<li className="flex flex-col gap-4">
			<div className="font-semibold text-xl flex items-center gap-2">
				{props.icon}
				{props.title}
			</div>
			<div className="flex flex-col gap-2">{props.children}</div>
		</li>
	);
}
