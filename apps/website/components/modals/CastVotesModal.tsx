"use client";

import type { nexus, proposals } from "~/packages/db/schema/public";
import { Modal, useModal } from "../Modal";
import { useEffect } from "react";
import { toast } from "../Toasts";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import {
	ArrowRight,
	Check,
	Plus,
	RefreshCcw,
	Save,
	UserPen,
	Vote,
	X,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { castVotes } from "@/server/mutations/castVotes";
import Link from "../Link";
import { usePrivy } from "@privy-io/react-auth";
import { env } from "~/env";

export default function CastVotesModal(props: {
	round: string;
	proposals: Array<
		typeof proposals.$inferSelect & {
			user: typeof nexus.$inferSelect;
		}
	>;
	selectedVotes: Record<string, number>;
	onVotesCast?: () => void;
}) {
	const { close, isOpen } = useModal("cast-votes");
	const { user } = usePrivy();

	const { hasSucceeded, isPending, executeAsync, reset } = useAction(castVotes);

	useEffect(() => reset(), [isOpen]);

	return (
		<Modal id="cast-votes" className="p-4 flex flex-col min-w-80 gap-6">
			{hasSucceeded ? (
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
					<img
						alt={`${props.round} votes`}
						src={`/api/images/votes?round=${props.round}&user=${user?.id}`}
						className="w-96 rounded-xl"
					/>
					<Link
						newTab
						href={`https://warpcast.com/~/compose?embeds[]=${env.NEXT_PUBLIC_DOMAIN}/api/images/votes?round=${props.round}&user=${user?.id}`}
						className="flex gap-1 items-center group hover:opacity-80 transition-opacity text-red"
					>
						Share this image on Warpcast{" "}
						<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
					</Link>
					<button
						onClick={() => close()}
						className="flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors"
					>
						Close
					</button>
				</>
			) : (
				<>
					<div className="flex justify-between items-center">
						<p className="text-white text-2xl font-bebas-neue leading-none">
							You are voting for
						</p>
						<button
							onClick={close}
							className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
						>
							<X className="w-4 h-4 text-grey-200" />
						</button>
					</div>
					<div className="flex flex-col gap-2">
						{Object.entries(props.selectedVotes).map(
							([proposalId, voteCount]) => {
								const proposal = props.proposals.find(
									(proposal) => proposal.id === Number(proposalId),
								);

								if (!proposal) return;
								if (voteCount < 1) return;

								return (
									<div
										key={proposal.id}
										className="flex justify-between items-center"
									>
										{proposal.user ? (
											<div className="flex items-center gap-2">
												<img
													src={proposal.user.image}
													alt={proposal.user.name}
													className="w-8 h-8 rounded-full"
												/>
												<p className="text-white text-lg font-bebas-neue leading-none">
													{proposal.user.name}
												</p>
											</div>
										) : (
											<p className="text-white text-lg font-bebas-neue leading-none">
												Proposal {proposal.id}
											</p>
										)}
										<p className="text-lg text-white">+ {voteCount}</p>
									</div>
								);
							},
						)}
					</div>
					<button
						onClick={async () => {
							const result = await executeAsync({
								round: props.round,
								votes: Object.entries(props.selectedVotes).map(
									([proposal, count]) => ({
										proposal: Number(proposal),
										count,
									}),
								),
							});

							if (result?.serverError) {
								return toast.error(result.serverError);
							}

							props.onVotesCast?.();
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
				</>
			)}
		</Modal>
	);
}
