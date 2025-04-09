"use client";

import { Sparkles, X } from "lucide-react";
import { Modal, ToggleModal, useModal } from "../Modal";
import type { getPredictions } from "@/server/queries/predictions";
import type { AuthenticatedUser } from "@/server/queries/users";
import { placeBet } from "@/server/mutations/placeBet";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";
import { simulateGains } from "@/server/queries/predictions";
import { toast } from "../Toasts";
import { twMerge } from "tailwind-merge";
import GoldSlider from "../GoldSlider";

export default function MakePredictionModal(props: {
	prediction: NonNullable<Awaited<ReturnType<typeof getPredictions>>>[number];
	user: AuthenticatedUser;
}) {
	const { close, isOpen } = useModal("make-prediction");

	const { hasSucceeded, isPending, executeAsync, reset } = useAction(placeBet);

	const [amount, setAmount] = useState(
		props.user.nexus ? Math.floor(Number(props.user.nexus.gold) / 10) : 0,
	);

	const [outcomeId, setOutcomeId] =
		useState<
			NonNullable<
				Awaited<ReturnType<typeof getPredictions>>
			>[number]["outcomes"][number]["id"]
		>();

	const shouldSimulateGains = useDebounce(amount, 1000);

	const { data: simulatedGains } = useQuery({
		queryKey: ["simulateGains", shouldSimulateGains],
		queryFn: async () => {
			const result = await simulateGains({
				prediction: props.prediction.id,
				outcome: outcomeId,
				amount,
			});

			setLoading(false);

			return result;
		},
	});

	const [loading, setLoading] = useState(false);

	const outcome = props.prediction.outcomes.find((o) => o.id === outcomeId);

	const odds = Number(outcome?.pool) / Number(props.prediction.pool);

	return (
		<Modal
			id="make-prediction"
			className="p-4 flex flex-col max-w-[500px] w-full gap-4"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Predict
				</p>
				<ToggleModal
					id="make-prediction"
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>
			{outcome ? (
				<div className="flex items-center justify-between gap-2 bg-grey-600 rounded-lg p-2">
					<div className="flex items-center gap-3">
						<img
							src={props.prediction.image}
							alt="prediction"
							className="w-8 h-8 rounded-md"
						/>
						<p className="text-white leading-none">{props.prediction.name}</p>
					</div>
					<div className="flex items-center gap-2">
						<p
							className={twMerge(
								"rounded-md text-sm font-semibold px-2 py-1 whitespace-nowrap",
								outcome.name.toLowerCase() === "no"
									? "text-red bg-red/30"
									: "text-green bg-green/30 ",
							)}
						>
							{outcome.name}
						</p>
						<button
							onClick={() => setOutcomeId(undefined)}
							className="text-red hover:text-red/70 transition-colors mr-1"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				</div>
			) : null}

			{!outcome ? (
				<ul className="flex flex-col gap-2 w-full bg-grey-600 rounded-lg p-2 px-3">
					{props.prediction.outcomes.map((o) => (
						<li
							key={`predict-outcome-${o.id}`}
							className="flex justify-between items-center"
						>
							<p className="text-white">{o.name}</p>
							<button
								onClick={() => setOutcomeId(o.id)}
								className="text-red hover:text-red/70 transition-colors"
							>
								Select
							</button>
						</li>
					))}
				</ul>
			) : null}

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

							if (value !== amount) {
								setLoading(true);
							}
						}}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2 w-full">
				<p className="text-white font-bebas-neue text-xl">Your Bet</p>
				<div className="flex w-full justify-between gap-2">
					<div className="flex flex-col">
						{outcomeId ? <p>Odds</p> : null}
						<p>Max win</p>
					</div>
					<div className="flex flex-col items-end">
						{outcomeId ? (
							<p className="text-white text-sm font-semibold">{odds}%</p>
						) : null}
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
					disabled={loading || isPending || !outcomeId}
					onClick={async () => {
						if (!outcomeId) return;

						const result = await executeAsync({
							prediction: props.prediction.id,
							outcome: outcomeId,
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
						loading || isPending || !outcomeId ? "opacity-50" : "",
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
