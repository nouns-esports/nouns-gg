"use client";

import { Modal, useModal } from "../Modal";
import { Sparkles, X } from "lucide-react";
import { create } from "zustand";
import { useAction } from "next-safe-action/hooks";
import { placeBet } from "@/server/mutations/placeBet";
import { useEffect, useState } from "react";
import { toast } from "../Toasts";
import { twMerge } from "tailwind-merge";
import GoldSlider from "../GoldSlider";
import type { AuthenticatedUser } from "@/server/queries/users";
import { simulateGains } from "@/server/queries/predictions";
import { useDebounce } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";
import type { getPredictions } from "@/server/queries/predictions";
import { getPredictionOdds } from "~/packages/utils/getPredictionOdds";

export default function PlaceBetModal(props: {
	prediction: NonNullable<Awaited<ReturnType<typeof getPredictions>>>[number];
	outcome: NonNullable<
		Awaited<ReturnType<typeof getPredictions>>
	>[number]["outcomes"][number];
	user: AuthenticatedUser;
}) {
	const { close, isOpen } = useModal(
		`place-bet-${props.prediction.id}-${props.outcome.id}`,
	);

	const { hasSucceeded, isPending, executeAsync, reset } = useAction(placeBet);

	useEffect(() => reset(), [isOpen]);

	const [amount, setAmount] = useState(
		props.user.nexus ? Number(props.user.nexus.gold) / 10 : 0,
	);

	const shouldSimulateGains = useDebounce(amount, 1000);

	const { data: simulatedGains } = useQuery({
		queryKey: ["simulateGains", shouldSimulateGains],
		queryFn: async () => {
			const result = await simulateGains({
				prediction: props.prediction.id,
				outcome: props.outcome.id,
				amount,
			});

			setLoading(false);

			return result;
		},
	});

	const [loading, setLoading] = useState(false);

	const odds = getPredictionOdds({
		prediction: props.prediction,
	});

	const outcomeOdds = odds.find((odd) => odd.id === props.outcome.id);

	return (
		<Modal
			id={`place-bet-${props.prediction.id}-${props.outcome.id}`}
			className="p-4 flex flex-col w-full max-w-96 gap-6"
		>
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
			<div className="flex items-center justify-between gap-2 bg-grey-600 rounded-lg p-2">
				<div className="flex items-center gap-3">
					<img
						src={props.prediction.image}
						alt="prediction"
						className="w-8 h-8 rounded-md"
					/>
					<p className="text-white leading-none">{props.prediction.name}</p>
				</div>
				<p
					className={twMerge(
						"rounded-md text-sm font-semibold px-2 py-1 whitespace-nowrap",
						props.outcome.name.toLowerCase() === "no"
							? "text-red bg-red/30"
							: "text-green bg-green/30 ",
					)}
				>
					{props.outcome.name}
				</p>
			</div>

			<div className="flex flex-col gap-2 w-full">
				<div className="flex justify-between items-center">
					<p className="text-white font-bebas-neue text-xl">Amount</p>
					{Number(props.user.nexus?.gold ?? 0) > 0 ? (
						<p className="text-gold-500 font-semibold">{amount}</p>
					) : (
						<p className="text-red">You don't have any gold</p>
					)}
				</div>
				<div
					className={twMerge(
						"bg-grey-800 rounded-xl p-2 px-3",
						Number(props.user.nexus?.gold ?? 0) < 1 &&
							"pointer-events-none opacity-50",
					)}
				>
					<GoldSlider
						min={0}
						max={Number(props.user.nexus?.gold ?? 0)}
						value={amount}
						onChange={(value) => {
							setAmount(value);
							setLoading(true);
						}}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2 w-full">
				<p className="text-white font-bebas-neue text-xl">Your Bet</p>
				<div className="flex w-full justify-between gap-2">
					<div className="flex flex-col">
						<p>Odds</p>
						<p>Max win</p>
					</div>
					<div className="flex flex-col items-end">
						<p className="text-white text-sm font-semibold">
							{outcomeOdds?.chance}%
						</p>
						{loading ? (
							<p className="text-white text-sm">Simulating...</p>
						) : (
							<div className="flex items-center gap-4">
								<div className=" flex items-center gap-1.5 text-sm text-white">
									<Sparkles className="w-4 h-4 text-green" />
									{props.prediction.xp}
								</div>
								{amount > 0 && simulatedGains ? (
									<div className="flex justify-center gap-1.5 items-center">
										<img
											alt="Gold coin"
											src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
											className="rounded-full h-4 w-4 shadow-xl"
										/>
										<p className="font-semibold text-[#FEBD1C]">
											{Number(simulatedGains).toFixed(2)}
										</p>
									</div>
								) : null}
							</div>
						)}
					</div>
				</div>
				<button
					disabled={loading || isPending}
					onClick={async () => {
						const result = await executeAsync({
							prediction: props.prediction.id,
							outcome: props.outcome.id,
							amount,
						});

						if (result?.serverError) {
							return toast.error(result.serverError);
						}

						toast.success("Bet placed successfully");
						close();
					}}
					className={twMerge(
						"flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors",
						loading || isPending ? "opacity-50" : "",
					)}
				>
					{loading || isPending ? (
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
			</div>
		</Modal>
	);
}
