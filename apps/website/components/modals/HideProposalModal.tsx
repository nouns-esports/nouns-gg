"use client";

import { X } from "lucide-react";
import { Modal, ToggleModal, useModal } from "../Modal";
import { toast } from "../Toasts";
import { useAction } from "next-safe-action/hooks";
import { hideProposal } from "@/server/mutations/hideProposal";
import { useRouter } from "next/navigation";

export default function HideProposalModal(props: {
	proposal: string;
}) {
	const { isOpen, close } = useModal(`hide-proposal-${props.proposal}`);

	const hideProposalAction = useAction(hideProposal);

	const router = useRouter();

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
				onClick={async () => {
					const result = await hideProposalAction.executeAsync({
						proposal: props.proposal,
					});

					if (result?.serverError) {
						return toast.error(result.serverError);
					}

					if (result?.data) {
						toast.success("Proposal hidden");
					}

					router.refresh();

					close();
				}}
				className="flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
			>
				{hideProposalAction.isPending ? (
					<img
						alt="loading spinner"
						src="/spinner.svg"
						className="h-[18px] animate-spin"
					/>
				) : (
					""
				)}
				Confirm
			</button>
		</Modal>
	);
}
