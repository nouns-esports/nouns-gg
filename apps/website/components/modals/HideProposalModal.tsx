"use client";

import { X } from "lucide-react";
import { Modal, ToggleModal, useModal } from "../Modal";

export default function HideProposalModal(props: {
	proposal: string;
}) {
	const { isOpen, close } = useModal(`hide-proposal-${props.proposal}`);

	return (
		<Modal
			id={`hide-proposal-${props.proposal}`}
			className="p-4 flex flex-col max-w-[500px] w-80 gap-8"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Hide Proposal
				</p>
				<ToggleModal
					id={`hide-proposal-${props.proposal}`}
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>

			<p className="text-white text-sm">
				Hiding this proposal will remove it from the round and prevent it from
				being voted on.
			</p>

			<button
				onClick={() => {
					close();
				}}
				className="flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors"
			>
				Confirm
			</button>
		</Modal>
	);
}
