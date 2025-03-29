"use client";

import { Modal, useModal } from "../Modal";
import { X } from "lucide-react";
import { create } from "zustand";
import { useAction } from "next-safe-action/hooks";
import { placeBet } from "@/server/mutations/placeBet";
import { useEffect } from "react";
import { toast } from "../Toasts";

export const usePlaceBetModal = create<{
	prediction?: {
		id: number;
	};
	outcome?: {
		id: number;
		name: string;
	};
	setState: (state: {
		outcome: {
			id: number;
			name: string;
		};
		prediction: {
			id: number;
		};
	}) => void;
}>((set) => ({
	prediction: undefined,
	outcome: undefined,
	setState: (state) => {
		set({ ...state });
	},
}));

export default function PlaceBetModal() {
	const { outcome, prediction } = usePlaceBetModal();

	const { close, isOpen } = useModal("place-bet");

	const { hasSucceeded, isPending, executeAsync, reset } = useAction(placeBet);

	useEffect(() => reset(), [isOpen]);

	return (
		<Modal id="place-bet" className="p-4 flex flex-col min-w-80 gap-6">
			{/* {hasSucceeded ? (
				<>
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
					<button
						onClick={() => close()}
						className="flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors"
					>
						Close
					</button>
				</>
			) : (
				<> */}
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Place Bet
				</p>
				<button
					onClick={close}
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</button>
			</div>
			<p className="text-white leading-none">
				You are betting for{" "}
				<span className="font-semibold text-green">{outcome?.name}</span>
			</p>
			<button
				onClick={async () => {
					if (!prediction || !outcome) return;

					const result = await executeAsync({
						prediction: prediction.id,
						outcome: outcome.id,
					});

					if (result?.serverError) {
						return toast.error(result.serverError);
					}

					toast.success("Bet placed successfully");
					close();
				}}
				className="flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors"
			>
				{isPending ? (
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
			{/* </>
			)} */}
		</Modal>
	);
}
