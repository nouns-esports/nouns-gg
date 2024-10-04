"use client";

import React, { useMemo, useState, useTransition } from "react";
import { CaretUp, CaretDown, ChartBarHorizontal } from "phosphor-react-sc";
import Button from "../Button";
import { twMerge } from "tailwind-merge";
import { castVotes } from "@/server/mutations/castVotes";
import toast from "react-hot-toast";
import { roundState } from "@/utils/roundState";
import { numberToOrdinal } from "@/utils/numberToOrdinal";
import { useOptimistic } from "react";
import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import type { getNexus } from "@/server/queries/nexus";
import { ToggleModal } from "../Modal";
import type { getRound } from "@/server/queries/rounds";
import { lexicalToDescription } from "@/utils/lexicalToDescription";
import Link from "../Link";
import { useModal } from "../Modal";
import { useAction, useOptimisticAction } from "next-safe-action/hooks";
import CastVotesModal from "../modals/CastVotesModal";
import ViewProposalModal from "../modals/VewProposalModal";
import type { AuthenticatedUser } from "@/server/queries/users";
import VoteSelector from "../VoteSelector";
import ShareVotesModal from "../modals/ShareVotesModal";

export default function Proposals(props: {
  round: NonNullable<
    Awaited<ReturnType<typeof getRound>> & {
      awardCount: number;
    }
  >;
  user?: AuthenticatedUser & {
    priorVotes: number;
  };
}) {
  const [selectedVotes, setSelectedVotes] = useState<Record<string, number>>(
    {}
  );

  function addVote(proposal: number, count: number) {
    if (remainingVotes < 1) return;

    setSelectedVotes((prev) => ({
      ...prev,
      [proposal]: (prev[proposal] ?? 0) + count,
    }));
  }

  function removeVote(proposal: number, count: number) {
    if ((selectedVotes[proposal] ?? 0) < 1) return;

    setSelectedVotes((prev) => ({
      ...prev,
      [proposal]: (prev[proposal] ?? 0) - count,
    }));
  }

  const votesSelected = useMemo(() => {
    return Object.values(selectedVotes).reduce((acc, curr) => acc + curr, 0);
  }, [selectedVotes]);

  const remainingVotes = useMemo(() => {
    return (
      (props.user?.nexus?.rank?.votes ?? 0) -
      votesSelected -
      (props.user?.priorVotes ?? 0)
    );
  }, [votesSelected, props.user?.nexus?.rank?.votes, props.user?.priorVotes]);

  const userProposal = props.round.proposals.find(
    (proposal) => proposal.user === props.user?.id
  );

  const { open: openSignInModal } = useModal("sign-in");
  const { open: openCastVotesModal } = useModal("cast-votes");
  const { open: openShareVotesModal } = useModal("share-votes");

  const state = roundState({
    start: props.round.start,
    votingStart: props.round.votingStart,
    end: props.round.end,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full gap-4 max-sm:flex-col max-sm:items-start">
          <h3 className="text-white font-luckiest-guy text-3xl">Proposals</h3>
          <div className="flex gap-4 items-center max-sm:justify-between max-sm:w-full">
            {(() => {
              if (state === "Proposing") {
                if (!props.user) {
                  return (
                    <>
                      <p className="text-white">
                        You must be signed in to propose
                      </p>
                      <Button onClick={() => openSignInModal()}>Sign In</Button>
                    </>
                  );
                }

                if (!props.user?.nexus?.rank) {
                  return (
                    <>
                      <p className="text-white">Enter the Nexus to propose</p>
                      <Button href="/nexus">Get Started</Button>
                    </>
                  );
                }

                if (
                  props.round.minProposerRank &&
                  props.user?.nexus?.rank.place <
                    props.round.minProposerRank.place
                ) {
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <p className="text-white">
                          You must be ranked at least
                        </p>
                        <img
                          src={props.round.minProposerRank.image}
                          alt={props.round.minProposerRank.name}
                          className="h-4 w-4 object-contain"
                        />
                        <p style={{ color: props.round.minProposerRank.color }}>
                          {props.round.minProposerRank.name}
                        </p>
                        <p className="text-white">to propose</p>
                      </div>
                      <Button href="/nexus">View Nexus</Button>
                    </>
                  );
                }

                if (userProposal) {
                  return (
                    <>
                      <p className="text-white">
                        You can edit your proposal until voting starts
                      </p>
                      <Button href={`/rounds/${props.round.id}/create`}>
                        Edit Proposal
                      </Button>
                    </>
                  );
                }

                return (
                  <Button href={`/rounds/${props.round.id}/create`}>
                    Create Proposal
                  </Button>
                );
              }

              if (state === "Voting") {
                if (!props.user) {
                  return (
                    <>
                      <p className="text-white">
                        You must be signed in to vote
                      </p>
                      <Button onClick={() => openSignInModal()}>Sign In</Button>
                    </>
                  );
                }

                if (!props.user?.nexus?.rank) {
                  return (
                    <>
                      <p className="text-white">Enter the Nexus to vote</p>
                      <Button href="/nexus">Get Started</Button>
                    </>
                  );
                }

                if (
                  props.round.minVoterRank &&
                  props.user?.nexus?.rank.place < props.round.minVoterRank.place
                ) {
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <p className="text-white">
                          You must be ranked at least
                        </p>
                        <img
                          src={props.round.minVoterRank.image}
                          alt={props.round.minVoterRank.name}
                          className="h-4 w-4 object-contain"
                        />
                        <p style={{ color: props.round.minVoterRank.color }}>
                          {props.round.minVoterRank.name}
                        </p>
                        <p className="text-white">to vote</p>
                      </div>
                      <Button href="/nexus">View Nexus</Button>
                    </>
                  );
                }

                if (
                  props.user?.nexus?.rank.votes > 0 &&
                  remainingVotes < 1 &&
                  votesSelected === 0
                ) {
                  return (
                    <>
                      <p className="text-white">
                        Your votes have been submitted
                      </p>
                      <ToggleModal id="share-votes">
                        <Button onClick={() => openShareVotesModal()}>
                          Share
                        </Button>
                      </ToggleModal>
                    </>
                  );
                }

                return (
                  <>
                    <p className="text-white">
                      {remainingVotes}/{props.user?.nexus?.rank.votes} votes
                      remaining
                    </p>
                    <Button
                      disabled={votesSelected < 1}
                      onClick={() => openCastVotesModal()}
                    >
                      Submit Votes
                    </Button>
                  </>
                );
              }

              if (state === "Ended") {
                if (props.user) {
                  for (let i = 0; i < props.round.awardCount; i++) {
                    if (props.round.proposals[i]?.user === props.user.id) {
                      return (
                        <>
                          <p className="text-white">Your proposal won!</p>
                          <Button href="/nexus">View Rewards</Button>
                        </>
                      );
                    }
                  }

                  if (
                    props.user?.nexus?.rank &&
                    props.user?.nexus?.rank.votes > 0 &&
                    remainingVotes < 1 &&
                    votesSelected === 0
                  ) {
                    return (
                      <>
                        <p className="text-white">
                          Your votes have been submitted
                        </p>
                        <ToggleModal id="share-votes">
                          <Button onClick={() => openShareVotesModal()}>
                            Share
                          </Button>
                        </ToggleModal>
                      </>
                    );
                  }
                }
              }
            })()}
          </div>
        </div>
        <div className="gap-4 grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {props.round.proposals
            .toSorted((a, b) => {
              if (state === "Proposing") {
                return (b.user?.rank?.place ?? 0) - (a.user?.rank?.place ?? 0);
              }

              return b.totalVotes - a.totalVotes;
            })
            .map((proposal, index) => (
              <ToggleModal
                key={proposal.id}
                id={`view-proposal-${proposal.id}`}
                className={twMerge(
                  "relative flex flex-col gap-4 bg-grey-800 hover:bg-grey-600 transition-colors rounded-xl overflow-hidden aspect-square w-full h-full group p-4",
                  props.round.type === "video" && "aspect-auto",
                  state === "Ended" &&
                    index < props.round.awardCount &&
                    index === 0 &&
                    "border-[3px] border-gold-500 bg-gold-900 hover:bg-gold-800 text-white",
                  state === "Ended" &&
                    index < props.round.awardCount &&
                    index === 1 &&
                    "border-[3px] border-silver-500 bg-silver-900 hover:bg-silver-800 text-white",
                  state === "Ended" &&
                    index < props.round.awardCount &&
                    index === 2 &&
                    "border-[3px] border-bronze-500 bg-bronze-900 hover:bg-bronze-800 text-white",
                  state === "Ended" &&
                    index > 2 &&
                    index < props.round.awardCount &&
                    "border-[3px] border-blue-500 bg-blue-900 hover:bg-blue-800 text-white"
                )}
              >
                {props.round.type === "markdown" ? (
                  <p className="text-white font-bebas-neue text-2xl line-clamp-2 flex-shrink-0 leading-[1.15] /h-[2lh]">
                    {proposal.title}
                  </p>
                ) : (
                  ""
                )}
                {props.round.type === "markdown" && !proposal.image ? (
                  <div className="relative w-full h-full overflow-hidden">
                    <p
                      className={twMerge(
                        "text-grey-200 h-full",
                        state === "Ended" &&
                          index < props.round.awardCount &&
                          "text-white"
                      )}
                    >
                      {lexicalToDescription(proposal.content ?? "")}
                    </p>
                    <div
                      className={twMerge(
                        "absolute left-0 w-full group-hover:opacity-0 opacity-100 transition-opacity bg-gradient-to-t from-grey-800 to-transparent h-10 bottom-0 z-10",
                        state === "Ended" &&
                          index < props.round.awardCount &&
                          index === 0 &&
                          "from-gold-900",
                        state === "Ended" &&
                          index < props.round.awardCount &&
                          index === 1 &&
                          "from-silver-900",
                        state === "Ended" &&
                          index < props.round.awardCount &&
                          index === 2 &&
                          "from-bronze-900",
                        state === "Ended" &&
                          index > 2 &&
                          index < props.round.awardCount &&
                          "from-blue-900"
                      )}
                    />
                    <div
                      className={twMerge(
                        "absolute left-0 w-full group-hover:opacity-100 opacity-0 transition-opacity bg-gradient-to-t from-grey-600 to-transparent h-20 bottom-0 z-10",
                        state === "Ended" &&
                          index < props.round.awardCount &&
                          index === 0 &&
                          "from-gold-800",
                        state === "Ended" &&
                          index < props.round.awardCount &&
                          index === 1 &&
                          "from-silver-800",
                        state === "Ended" &&
                          index < props.round.awardCount &&
                          index === 2 &&
                          "from-bronze-800",
                        state === "Ended" &&
                          index > 2 &&
                          index < props.round.awardCount &&
                          "from-blue-800"
                      )}
                    />
                  </div>
                ) : (
                  <img
                    src={`${proposal.image}?img-width=500&img-onerror=redirect`}
                    className={twMerge(
                      "flex w-full h-full object-cover overflow-hidden rounded-xl select-none",
                      props.round.type === "video" && "aspect-video h-auto"
                    )}
                  />
                )}
                <div className="flex justify-between items-center flex-shrink-0">
                  {proposal.user ? (
                    <Link
                      href={`/users/${proposal.user.discord ?? proposal.user.id}`}
                      className="flex gap-2 items-center text-white"
                    >
                      <img
                        src={proposal.user.image}
                        className="h-6 w-6 rounded-full"
                      />
                      {proposal.user.name}
                    </Link>
                  ) : (
                    <div />
                  )}
                  <div className="flex items-center gap-4">
                    {state === "Ended" && index < props.round.awardCount ? (
                      <div
                        className={twMerge(
                          "rounded-md bg-grey-600 font-bold text-white flex items-center text-sm justify-center px-2 py-0.5",
                          index === 0 && "bg-gold-500 text-gold-900",
                          index === 1 && "bg-silver-500 text-silver-900",
                          index === 2 && "bg-bronze-500 text-bronze-900",
                          index > 2 && "bg-blue-500 text-blue-900"
                        )}
                      >
                        {numberToOrdinal(index + 1)}
                      </div>
                    ) : (
                      ""
                    )}

                    <VoteSelector
                      proposal={proposal.id}
                      votes={proposal.totalVotes}
                      addVote={addVote}
                      removeVote={removeVote}
                      selectedVotes={selectedVotes[proposal.id]}
                      userRank={props.user?.nexus?.rank ?? undefined}
                      minRank={props.round.minVoterRank ?? undefined}
                      awardCount={props.round.awardCount}
                      index={index}
                      roundState={state}
                      remainingVotes={remainingVotes}
                    />
                  </div>
                </div>
              </ToggleModal>
            ))}
          {props.round.proposals.length < 1 ? (
            <div className="mt-4 flex gap-4 justify-center items-center">
              <img src="/fire-sticker.png" alt="" className="h-32" />
              <p className="text-grey-200 text-lg max-w-80">
                There are no proposals yet.{" "}
                {state === "Proposing" ? "Be the first to propose?" : ""}
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <CastVotesModal
        round={props.round.id}
        proposals={props.round.proposals}
        selectedVotes={selectedVotes}
        onVotesCast={() => setSelectedVotes({})}
      />
      <ShareVotesModal round={props.round.id} />
      {props.round.proposals.map((proposal) => (
        <ViewProposalModal
          key={proposal.id}
          round={props.round}
          proposal={proposal}
          user={props.user}
          addVote={addVote}
          removeVote={removeVote}
          selectedVotes={selectedVotes}
          remainingVotes={remainingVotes}
        />
      ))}
    </>
  );
}
