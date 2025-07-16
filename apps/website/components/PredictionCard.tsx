import type { getPredictions } from "@/server/queries/predictions";
import { twMerge } from "tailwind-merge";
import Link from "./Link";
import { Check, Plus, Sparkles, Vote } from "lucide-react";
import { LockSimple } from "phosphor-react-sc";
import { formatGold } from "~/packages/utils/formatGold";
import { parsePrediction } from "~/packages/utils/parsePrediction";

export default function PredictionCard(props: {
	prediction: NonNullable<Awaited<ReturnType<typeof getPredictions>>>[number];
	className?: string;
}) {
	const { state, outcomes, userBet } = parsePrediction(props.prediction);

	return (
		<Link
			href={`/c/${props.prediction.community.handle}/predictions/${props.prediction.handle}`}
			className={twMerge(
				"relative flex flex-col gap-4 p-4 aspect-video min-h-0 w-full bg-grey-800 hover:bg-grey-600 transition-colors rounded-xl",
				props.className,
			)}
		>
			<div className="flex w-full justify-between gap-6">
				<div className="flex items-center gap-3">
					<img
						src={props.prediction.image}
						className="w-10 h-10 rounded-md object-cover object-center"
					/>
					<p className="text-white font-bebas-neue text-lg leading-tight line-clamp-2">
						{props.prediction.name}
					</p>
				</div>
				<div
					className={twMerge(
						"flex items-center gap-1.5 px-3 py-1 h-min text-sm rounded-full bg-red/30 text-red whitespace-nowrap",
						state === "resolved" && "bg-green/30 text-green",
						state === "closed" && " bg-blue-500/30 text-blue-500",
					)}
				>
					{state === "open" ? (
						<div className="w-2 h-2 rounded-full animate-pulse bg-red" />
					) : null}
					{state === "closed" ? (
						<LockSimple className="w-3.5 h-3.5 text-blue-500" weight="fill" />
					) : null}
					{
						{
							resolved: "Finalized",
							closed: "Awaiting Results",
							open: "Live",
						}[state]
					}
				</div>
			</div>
			<div
				className={twMerge(
					"flex gap-16 w-full overflow-y-auto scrollbar-hidden",
					userBet ? "rounded-b-xl" : "h-full",
				)}
			>
				<div className="flex flex-col gap-2">
					{outcomes.map((outcome) => (
						<p
							key={`outcome-left-${outcome.id}`}
							className={twMerge(
								"flex items-center gap-1.5 text-white text-sm whitespace-nowrap h-5",
								state === "resolved" && outcome.result && "text-green",
								state !== "resolved" &&
									userBet?.outcome.id === outcome.id &&
									"text-[#FEBD1C]",
							)}
						>
							{outcome.result ? <Check className="w-4 h-4" /> : null}
							{outcome.name}
						</p>
					))}
					{userBet ? <div className="w-full h-12 flex-shrink-0" /> : null}
				</div>
				<div className="flex flex-col gap-2 w-full">
					{outcomes.map((outcome) => {
						const odds = Math.ceil(
							(Number(outcome.pool) / Number(props.prediction.pool)) * 100,
						);

						return (
							<div
								key={`outcome-right-${outcome.id}`}
								className="flex w-full items-center justify-end gap-2 h-5"
							>
								<div
									style={{
										width: `${odds <= 1 ? odds + 2 : odds}%`,
									}}
									className={twMerge(
										"h-3 rounded-full bg-grey-500",
										state !== "resolved" &&
											userBet?.outcome.id === outcome.id &&
											"bg-[#FEBD1C]",
										state === "resolved" && outcome.result && "bg-green",
									)}
								/>
								<p className="text-white text-sm">{odds}%</p>
							</div>
						);
					})}
					{userBet ? <div className="w-full h-12 flex-shrink-0" /> : null}
				</div>
			</div>
			{userBet ? (
				<div className="absolute bottom-4 left-0 w-full px-4">
					<div className="flex items-center justify-between w-full bg-grey-500 rounded-lg py-2 px-3 ">
						{userBet.outcome.result && userBet ? (
							<>
								<div className="flex items-center gap-1">
									<p className="text-white text-sm">You predicted</p>
									<p className="text-[#FEBD1C] font-semibold text-sm">
										{userBet.outcome.name}
									</p>
									<p className="text-white text-sm">and</p>
									<p className="text-green font-semibold text-sm">won</p>
								</div>
								{/* <div className="text-sm text-[#FEBD1C] font-semibold rounded-md flex items-center gap-1">
									<Plus className="w-3 h-3" />
									<img
										alt="Gold coin"
										src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
										className="rounded-full h-4 w-4 shadow-xl"
									/>
									{formatGold(Number(user.winnings.amount))}
								</div> */}
							</>
						) : null}
						{userBet.outcome.result === false ? (
							<div className="flex items-center gap-1">
								<p className="text-white text-sm">You predicted</p>
								<p className="text-[#FEBD1C] font-semibold text-sm">
									{userBet.outcome.name}
								</p>
								<p className="text-white text-sm">and</p>
								<p className="text-red font-semibold text-sm">lost</p>
							</div>
						) : null}
						{userBet.outcome.result === null ? (
							<>
								<div className="flex items-center gap-1">
									<p className="text-white text-sm">You predicted</p>
									<p className="text-[#FEBD1C] font-semibold text-sm">
										{userBet.outcome.name}
									</p>
								</div>
								{/* <div className="text-sm text-[#FEBD1C] font-semibold rounded-md flex items-center gap-1">
									<img
										alt="Gold coin"
										src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
										className="rounded-full h-4 w-4 shadow-xl"
									/>
									{formatGold(Number(user.bet.amount))}
								</div> */}
							</>
						) : null}
					</div>
				</div>
			) : null}
			{!userBet ? (
				<div className="w-full flex justify-between items-center">
					<p className="text-sm flex items-center gap-1.5 cursor-default">
						<Vote className="w-4 h-4" />
						{props.prediction.totalBets} prediction
						{props.prediction.totalBets === 1 ? "" : "s"} placed
					</p>
					<div className="flex items-center gap-2 text-white text-sm">
						<Sparkles className="w-4 h-4 text-green" />
						{props.prediction.xp}
					</div>
				</div>
			) : null}
		</Link>
	);
}
