"use client";

import { Modal, useModal } from "../Modal";
import { ArrowRight, X } from "lucide-react";
import Link from "../Link";
import { usePrivy } from "@privy-io/react-auth";
import { env } from "~/env";
import Shimmer from "../Shimmer";
import type { AuthenticatedUser } from "@/server/queries/users";

export default function ShareVotesModal(props: {
	round: string;
	user: AuthenticatedUser;
}) {
	const { close } = useModal("share-votes");

	return (
		<Modal id="share-votes" className="p-4 flex flex-col min-w-80 gap-4">
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Your Votes
				</p>
				<button
					onClick={close}
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</button>
			</div>
			<div className="relative w-96 aspect-[3/2]">
				<Shimmer className="absolute left-0 top-0 bg-grey-800" />
				<img
					alt={`${props.round} votes`}
					src={`/api/images/votes?round=${props.round}&user=${props.user.id}`}
					className="relative z-10 rounded-xl"
				/>
			</div>
			<Link
				newTab
				// href={`/chat?post=true&embeds[]=${env.NEXT_PUBLIC_DOMAIN}/api/frames/rounds/${props.round}/votes/${user?.id}/`}
				href={`https://farcaster.xyz/~/compose?embeds[]=${env.NEXT_PUBLIC_DOMAIN}/rounds/${props.round}?user=${props.user.id}`}
				className="flex gap-1 items-center group hover:opacity-80 transition-opacity text-red"
			>
				Share this image on Farcaster
				<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
			</Link>
			<button
				onClick={() => close()}
				className="flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors"
			>
				Close
			</button>
		</Modal>
	);
}
