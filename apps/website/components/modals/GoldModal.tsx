"use client";

import { X } from "lucide-react";
import { Modal, ToggleModal, useModal } from "../Modal";
import type { AuthenticatedUser } from "@/server/queries/users";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoldModal(props: { user: AuthenticatedUser }) {
	const router = useRouter();
	const pathname = usePathname();

	const { isOpen, close } = useModal("gold");

	useEffect(() => {
		if (!isOpen) return;

		if (pathname === "/leaderboard") {
			close();
		}
	}, [isOpen, pathname]);

	return (
		<Modal id="gold" className="p-4 flex flex-col max-w-[500px] w-80 gap-8">
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Your Gold
				</p>
				<ToggleModal
					id="gold"
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>

			<div className="flex justify-center gap-2.5 items-center">
				<img
					alt="Gold coin"
					src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
					className="rounded-full h-10 w-10 shadow-xl"
				/>
				<p className="font-semibold text-4xl text-[#FEBD1C]">
					{Number(props.user?.nexus?.gold) ?? 0}
				</p>
			</div>
			<button
				onClick={() => {
					if (pathname === "/leaderboard") return close();

					router.push("/leaderboard");
				}}
				className="flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors"
			>
				Earn More
			</button>
		</Modal>
	);
}
