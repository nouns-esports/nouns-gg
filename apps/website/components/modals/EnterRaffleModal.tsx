"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Modal, ToggleModal, useModal } from "../Modal";
import type { getRaffles } from "@/server/queries/raffles";
import { useState } from "react";
import { enterRaffle } from "@/server/mutations/enterRaffle";
import { useAction } from "next-safe-action/hooks";
import { toast } from "../Toasts";
import { confetti } from "@/utils/confetti";

export default function EnterRaffleModal(props: {
	availableGold: number;
	raffle: NonNullable<Awaited<ReturnType<typeof getRaffles>>>[number];
}) {
	const { isOpen, close } = useModal(`raffle:${props.raffle.id}`);

	const [amount, setAmount] = useState(1);

	const enterRaffleAction = useAction(enterRaffle);

	const userEntries = props.raffle.entries.reduce(
		(acc, entry) => acc + entry.amount,
		0,
	);

	return (
		<Modal
			id={`raffle:${props.raffle.id}`}
			className="p-4 flex flex-col max-w-[400px] max-md:max-w-none w-full gap-8"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Enter Raffle
				</p>
				<ToggleModal
					id={`raffle:${props.raffle.id}`}
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>
			<div className="flex flex-col gap-2">
				<img
					src={props.raffle.images[0]}
					alt={props.raffle.name}
					className="w-full aspect-square object-cover rounded-lg"
				/>
			</div>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<p className="text-white font-bebas-neue text-lg">Total Cost: </p>
					<div className="flex items-center gap-2">
						<img
							src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
							alt="Gold"
							className="w-6 h-6"
						/>
						<p className="text-[#FEBD1C] text-lg font-semibold">
							{props.raffle.gold * amount}
						</p>
					</div>
				</div>
				<div className="flex gap-2">
					<div className="flex">
						<button
							onClick={() => {
								setAmount(amount - 1);
							}}
							className="text-white text-sm bg-grey-500 rounded-l-lg p-2"
						>
							<ChevronLeft className="w-4 h-4 text-grey-200" />
						</button>
						<input
							type="text"
							pattern="[0-9]*"
							className="max-w-32 w-10 bg-grey-500 text-white text-center outline-none"
							value={amount}
							onChange={(e) => {
								if (
									Number(e.target.value) * props.raffle.gold >
									props.availableGold
								) {
									return;
								}

								if (Number.isNaN(Number(e.target.value))) return;

								setAmount(Number(e.target.value));
							}}
						/>
						<button
							onClick={() => {
								if (amount * props.raffle.gold > props.availableGold) return;
								if (
									props.raffle.limit &&
									amount + userEntries > props.raffle.limit
								)
									return;
								setAmount(amount + 1);
							}}
							className="text-white text-sm bg-grey-500 rounded-r-lg p-2"
						>
							<ChevronRight className="w-4 h-4 text-grey-200" />
						</button>
					</div>
					<button
						disabled={amount < 1}
						onClick={async () => {
							if (amount < 1) return;

							const result = await enterRaffleAction.executeAsync({
								raffle: props.raffle.id,
								amount,
							});

							if (result?.serverError) {
								return toast.error(result.serverError);
							}

							if (result?.data) {
								toast.xp({
									total: result.data.newXP,
									earned: result.data.earnedXP,
								});
								toast.custom(result.data.notification);
							}

							confetti();
							close();
						}}
						className="flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
					>
						{enterRaffleAction.isPending ? (
							<img
								alt="loading spinner"
								src="/spinner.svg"
								className="h-[18px] animate-spin"
							/>
						) : (
							""
						)}
						Enter
					</button>
				</div>
			</div>
		</Modal>
	);
}
