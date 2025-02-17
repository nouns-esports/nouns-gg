"use client";

import { X } from "lucide-react";
import { Modal, ToggleModal } from "../Modal";
import { useAction } from "next-safe-action/hooks";
import { placeRank } from "@/server/mutations/placeRank";

export default function EnterNexusModal(props: {
	linkedFarcaster: boolean;
	inServer: boolean;
}) {
	const placeRankAction = useAction(placeRank);

	return (
		<Modal
			id="enter-nexus"
			className="p-4 flex flex-col max-w-[500px] w-80 gap-8"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Enter the Nexus
				</p>
				<ToggleModal
					id="enter-nexus"
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<p className="text-white text-sm">Link a Farcaster account</p>
					<div className="w-2 h-2 rounded-full bg-green" />
				</div>
				<div className="flex items-center gap-2">
					<p className="text-white text-sm">Join the server</p>
					<div className="w-2 h-2 rounded-full bg-green" />
				</div>
			</div>
			<button
				disabled={!props.linkedFarcaster && !props.inServer}
				onClick={async () => {
					if (!props.linkedFarcaster && !props.inServer) return;

					await placeRankAction.executeAsync();
				}}
				className="flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors"
			>
				Begin your journey
			</button>
		</Modal>
	);
}
