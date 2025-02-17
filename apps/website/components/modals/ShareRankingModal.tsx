"use client";

import { ArrowRight, X } from "lucide-react";
import { Modal, ToggleModal } from "../Modal";
import type { Rankings } from "~/packages/db/schema";
import type { getLeaderboardPosition } from "@/server/queries/rankings";
import { twMerge } from "tailwind-merge";
import { CaretDown } from "phosphor-react-sc";
import { CaretUp } from "phosphor-react-sc";
import Link from "../Link";
import Shimmer from "../Shimmer";
import { env } from "~/env";

export default function ShareRankingModal(props: {
	ranking: NonNullable<Awaited<ReturnType<typeof getLeaderboardPosition>>>;
}) {
	const diff = props.ranking.previousPosition - props.ranking.position;

	return (
		<Modal
			id="share-ranking"
			className="p-4 flex flex-col max-w-[500px] w-96 gap-4"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Your Ranking
				</p>
				<ToggleModal
					id="share-ranking"
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>
			<div className="relative w-full aspect-[3/2]">
				<Shimmer className="absolute left-0 top-0 bg-grey-800" />
				<img
					alt={`${props.ranking.user.name} ranking`}
					src={`/api/images/rankings?user=${props.ranking.user.id}`}
					className="absolute z-10 w-full rounded-xl"
				/>
			</div>
			<Link
				newTab
				// href={`/chat?post=true&embeds[]=${env.NEXT_PUBLIC_DOMAIN}/api/frames/rounds/${props.round}/votes/${user?.id}/`}
				href={`https://warpcast.com/~/compose?embeds[]=${env.NEXT_PUBLIC_DOMAIN}/leaderboard?user=${props.ranking.user.id}`}
				className="flex gap-1 items-center group hover:opacity-80 transition-opacity text-red"
			>
				Share this image on Warpcast
				<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
			</Link>
		</Modal>
	);
}
