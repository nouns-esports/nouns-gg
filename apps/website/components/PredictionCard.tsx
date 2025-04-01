"use client";

import { twMerge } from "tailwind-merge";
import Link from "./Link";
import { Check, Sparkles, Vote, X } from "lucide-react";
import { useModal } from "./Modal";
import { usePlaceBetModal } from "./modals/PlaceBetModal";
import type { AuthenticatedUser } from "@/server/queries/users";
import { getPredictions } from "@/server/queries/predictions";

export default function PredictionCard(props: {
	prediction: NonNullable<Awaited<ReturnType<typeof getPredictions>>>[number];
	user?: AuthenticatedUser;
	className?: string;
}) {
	return (
		<Link
			href={`/predictions/${props.prediction.handle}`}
			className={twMerge(
				"flex flex-col gap-2 bg-grey-800 rounded-xl px-2 pb-3 pt-4 hover:bg-grey-600 transition-colors aspect-video h-full justify-between",
				props.prediction.closed && "opacity-50 pointer-events-none",
				props.className,
			)}
		>
			<div className="flex justify-between gap-8 px-2 items-center">
				<div className="flex items-center gap-4">
					<img
						alt={props.prediction.name}
						src={props.prediction.image}
						className="w-[44px] h-[44px] rounded-lg object-cover aspect-square"
					/>
					<p className="text-white font-bebas-neue text-xl line-clamp-2 leading-tight">
						{props.prediction.name}
					</p>
				</div>
				{props.prediction.outcomes.length === 2 ? (
					<div className="rounded-lg flex flex-col items-center">
						<p className="text-white leading-none">
							{props.prediction.outcomes.every(
								(outcome) =>
									Number(outcome.pool) === Number(props.prediction.pool),
							)
								? 50
								: Math.round(
										(Number(
											props.prediction.outcomes.toSorted((a, b) =>
												a.name === "Yes"
													? -1
													: b.name === "Yes"
														? 1
														: a.name.localeCompare(b.name),
											)[0].pool,
										) /
											Number(props.prediction.pool)) *
											100,
									)}
							%
						</p>
						<p className="text-white/50 text-sm">chance</p>
					</div>
				) : null}
			</div>
			<div className="flex flex-col flex-1 min-h-0 justify-end gap-3">
				{props.prediction.outcomes.length > 2 ? (
					<MultiOutcome prediction={props.prediction} user={props.user} />
				) : (
					<BinaryOutcome prediction={props.prediction} user={props.user} />
				)}
			</div>
			<div className="flex justify-between items-center px-2">
				<p className="text-sm flex items-center gap-1.5 cursor-default">
					<Vote className="w-4 h-4" />
					{props.prediction.totalBets} bet
					{props.prediction.totalBets === 1 ? "" : "s"} placed
				</p>
				<p
					title={`${props.prediction.xp} xp`}
					className="text-white flex items-center gap-2 mr-1 text-sm cursor-default"
				>
					<Sparkles className="w-4 h-4 text-green" />
					{props.prediction.xp}
				</p>
			</div>
		</Link>
	);
}

function MultiOutcome(props: {
	prediction: NonNullable<Awaited<ReturnType<typeof getPredictions>>>[number];
	user?: AuthenticatedUser;
}) {
	const { open } = useModal("place-bet");
	const { open: openSignIn } = useModal("sign-in");
	const { setState } = usePlaceBetModal();

	return (
		<div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar mr-2">
			{props.prediction.outcomes
				.toSorted((a, b) => a.name.localeCompare(b.name))
				.map((outcome) => {
					const userBet = props.prediction.bets
						.filter((bet) => bet.user === props.user?.id)
						.find((bet) => bet.outcome.id === outcome.id);

					const userBetAmount = Number(userBet?.amount ?? 0);

					const odds = props.prediction.outcomes.every(
						(outcome) => Number(outcome.pool) === Number(props.prediction.pool),
					)
						? 100 / props.prediction.outcomes.length
						: Math.round(
								(Number(outcome.pool) / Number(props.prediction.pool)) * 100,
							);

					return (
						<div
							key={outcome.id}
							className="flex w-full pl-2 py-1 rounded-lg text-white hover:text-white/70 transition-colors justify-between"
						>
							{outcome.name}
							<div className="flex items-center gap-3">
								{userBetAmount > 0 ? (
									<div className="text-sm text-[#FEBD1C] font-semibold rounded-md flex items-center gap-1">
										<img
											alt="Gold coin"
											src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
											className="rounded-full h-4 w-4 shadow-xl"
										/>
										{userBetAmount}
									</div>
								) : null}
								{userBet?.outcome.id === outcome.id && userBetAmount === 0 ? (
									<div className="text-sm text-green flex items-center gap-1">
										<Check className="w-4 h-4" />
										Your bet
									</div>
								) : null}
								<p className="text-sm">{odds}%</p>

								<button
									onClick={(e) => {
										e.preventDefault();

										if (!props.user) {
											openSignIn();
											return;
										}

										setState({
											outcome,
											prediction: props.prediction,
											user: props.user,
											odds,
										});
										open();
									}}
									className={twMerge(
										"text-sm px-2 py-0.5 rounded-md transition-colors",
										userBet
											? "text-[#FEBD1C] bg-[#4F3101] hover:bg-[#623C00]"
											: "text-green bg-green/30 hover:bg-green/50",
									)}
								>
									{userBetAmount > 0 ? "Add" : userBet ? "Bet Gold" : "Bet"}
								</button>
							</div>
						</div>
					);
				})}
		</div>
	);
}

function BinaryOutcome(props: {
	prediction: NonNullable<Awaited<ReturnType<typeof getPredictions>>>[number];
	user?: AuthenticatedUser;
}) {
	const { open } = useModal("place-bet");
	const { open: openSignIn } = useModal("sign-in");
	const { setState } = usePlaceBetModal();

	const yesOutcome =
		props.prediction.outcomes.find((outcome) => outcome.name === "Yes") ??
		props.prediction.outcomes.toSorted((a, b) =>
			a.name.localeCompare(b.name),
		)[0];

	const noOutcome =
		props.prediction.outcomes.find((outcome) => outcome.name === "No") ??
		props.prediction.outcomes.find((outcome) => outcome.id !== yesOutcome.id);

	if (!noOutcome) {
		throw new Error("No second outcome found");
	}

	const userBet = props.prediction.bets.find(
		(bet) => bet.user === props.user?.id,
	);

	const userBetAmount = Number(userBet?.amount ?? 0);

	if (userBet) {
		return (
			<div className="flex justify-between items-center w-full pl-3 pr-1 gap-2 mb-1 bg-grey-500 rounded-lg py-1">
				<p className="text-white">
					<span>You bet</span>
					<span
						className={twMerge(
							"px-2 py-0.5 rounded-md",
							userBet.outcome.id === yesOutcome.id ? "text-green" : "text-red",
						)}
					>
						{userBet.outcome.name}
					</span>
				</p>
				<div className="flex items-center justify-between gap-2 rounded-lg">
					{userBetAmount > 0 ? (
						<div className="text-[#FEBD1C] font-semibold rounded-md flex items-center gap-1">
							<img
								alt="Gold coin"
								src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
								className="rounded-full h-4 w-4 shadow-xl"
							/>
							{userBetAmount}
						</div>
					) : null}
					<button
						onClick={(e) => {
							e.preventDefault();

							if (!props.user) {
								return openSignIn();
							}

							setState({
								outcome:
									userBet.outcome.id === yesOutcome.id ? noOutcome : yesOutcome,
								prediction: props.prediction,
								user: props.user,
								odds: props.prediction.outcomes.every(
									(outcome) =>
										Number(outcome.pool) === Number(props.prediction.pool),
								)
									? 50
									: Math.round(
											(Number(
												props.prediction.outcomes.toSorted((a, b) =>
													a.name === "Yes"
														? -1
														: b.name === "Yes"
															? 1
															: a.name.localeCompare(b.name),
												)[0].pool,
											) /
												Number(props.prediction.pool)) *
												100,
										),
							});
							open();
						}}
						className="text-sm  transition-colors px-2 py-0.5 rounded-md text-[#FEBD1C] bg-[#4F3101] hover:bg-[#623C00]"
					>
						{userBetAmount > 0 ? "Add" : "Bet Gold"}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex w-full gap-2 px-2">
			{[yesOutcome, noOutcome].map((outcome, index) => (
				<button
					onClick={(e) => {
						e.preventDefault();

						if (!props.user) {
							return openSignIn();
						}

						setState({
							outcome,
							prediction: props.prediction,
							user: props.user,
							odds: Number(props.prediction.pool) / Number(outcome.pool),
						});
						open();
					}}
					key={outcome.id}
					className={twMerge(
						"w-full flex items-center justify-center py-2 rounded-lg text-white transition-colors",
						index === 0 && "bg-green/30  text-green hover:bg-green/50",
						index === 1 && "bg-red/30  text-red hover:bg-red/50",
					)}
				>
					{outcome.name}
				</button>
			))}
		</div>
	);
}
