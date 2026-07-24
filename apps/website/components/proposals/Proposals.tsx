import type { getRound } from "@/server/queries/rounds";
import { lexicalToDescription } from "@/utils/lexicalToDescription";
import { numberToOrdinal } from "@/utils/numberToOrdinal";
import { roundState } from "@/utils/roundState";
import { twMerge } from "tailwind-merge";
import Countdown from "../Countdown";
import Link from "../Link";

export default function Proposals(props: {
	round: NonNullable<Awaited<ReturnType<typeof getRound>>>;
	user?: never;
	openProposal?: string;
	allocatedVotes: number;
	unusedPurchasedVotes: number;
}) {
	const state = roundState(props.round);
	const proposals = props.round.proposals.toSorted((a, b) => {
		if (a.winner != null && b.winner != null) return a.winner - b.winner;
		if (a.winner != null) return -1;
		if (b.winner != null) return 1;
		return (
			b.totalVotes - a.totalVotes ||
			+new Date(b.createdAt) - +new Date(a.createdAt)
		);
	});

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between gap-4 max-md:items-start">
				<h3 className="text-3xl font-luckiest-guy text-white">Proposals</h3>
				{state !== "Ended" && state !== "Upcoming" ? (
					<div className="flex items-center gap-2 rounded-xl bg-grey-800 px-3 py-2 font-semibold">
						<div className="h-2 w-2 rounded-full bg-red" />
						<p className="text-red">{state}</p>
						<p className="text-white">
							<Countdown
								date={
									state === "Proposing"
										? props.round.votingStart
										: props.round.end
								}
							/>
						</p>
					</div>
				) : null}
			</div>
			<div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
				{proposals.map((proposal, index) => (
					<article
						key={proposal.id}
						className={twMerge(
							"flex aspect-square h-full w-full flex-col gap-4 overflow-hidden rounded-xl bg-grey-800 p-4",
							state === "Ended" &&
								index === 0 &&
								"border-[3px] border-gold-500 bg-gold-900",
							state === "Ended" &&
								index === 1 &&
								"border-[3px] border-silver-500 bg-silver-900",
							state === "Ended" &&
								index === 2 &&
								"border-[3px] border-bronze-500 bg-bronze-900",
						)}
					>
						<h4 className="line-clamp-2 flex-shrink-0 font-bebas-neue text-2xl leading-[1.15] text-white">
							{proposal.title}
						</h4>
						{proposal.image ? (
							<img
								alt={proposal.title}
								src={`${proposal.image}?img-width=500&img-onerror=redirect`}
								className="h-full w-full overflow-hidden rounded-xl object-cover"
							/>
						) : (
							<p className="h-full overflow-hidden text-grey-200">
								{lexicalToDescription(proposal.content ?? "")}
							</p>
						)}
						<div className="flex flex-shrink-0 items-center justify-between gap-3">
							{proposal.user ? (
								<Link
									href={`/users/${proposal.user.id}`}
									className="flex min-w-0 items-center gap-2 text-white"
								>
									<img
										alt={proposal.user.name}
										src={proposal.user.image}
										className="h-6 w-6 rounded-full object-cover"
									/>
									<span className="truncate">{proposal.user.name}</span>
								</Link>
							) : (
								<span />
							)}
							<div className="flex items-center gap-2 text-sm font-bold text-white">
								{state === "Ended" && proposal.winner != null ? (
									<span>{numberToOrdinal(proposal.winner)}</span>
								) : null}
								<span>{proposal.totalVotes} votes</span>
							</div>
						</div>
					</article>
				))}
			</div>
			{proposals.length === 0 ? (
				<p className="rounded-xl bg-grey-800 p-6 text-grey-200">
					No proposals were submitted for this round.
				</p>
			) : null}
		</div>
	);
}
