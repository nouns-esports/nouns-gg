import CastCard from "@/components/CastCard";
import GoBack from "@/components/GoBack";
import Link from "@/components/Link";
import NavigateBack from "@/components/NavigateBack";
import Upvote from "@/components/Upvote";
import { getCast } from "@/server/queries/farcaster";
import {
	getAuthenticatedUser,
	type AuthenticatedUser,
} from "@/server/queries/users";
import type { CastWithInteractionsAndConversationsRef } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default async function Cast(props: {
	params: Promise<{ cast: string }>;
}) {
	const params = await props.params;
	const user = await getAuthenticatedUser();

	const cast = await getCast({
		hash: params.cast,
		viewerFid: user?.farcaster?.fid,
	});

	function renderComments(
		comment: CastWithInteractionsAndConversationsRef,
		level: number,
	) {
		if (comment.direct_replies.length > 0) {
			return (
				<div className="flex flex-col gap-4">
					<Comment
						key={comment.hash}
						hash={comment.hash}
						author={{
							pfp_url: comment.author.pfp_url,
							username: comment.author.username,
						}}
						upvoted={!!comment.viewer_context?.liked}
						text={comment.text}
						level={level}
						upvotes={comment.reactions.likes_count}
					/>
					<div className=" flex w-full gap-4 relative">
						<div className="absolute left-0 -top-4 w-12 h-[calc(100%_-_50px)] flex flex-col items-center">
							<div className="h-full bg-grey-200 w-0.5 hover:bg-white" />
						</div>
						<div className="ml-12 flex flex-col gap-4 w-full">
							{comment.direct_replies
								.toSorted(
									(a, b) =>
										(b as CastWithInteractionsAndConversationsRef).reactions
											.likes_count -
										(a as CastWithInteractionsAndConversationsRef).reactions
											.likes_count,
								)
								.map((c) =>
									renderComments(
										c as CastWithInteractionsAndConversationsRef,
										level + 1,
									),
								)}
						</div>
					</div>
				</div>
			);
		}

		return (
			<Comment
				key={comment.hash}
				hash={comment.hash}
				author={{
					pfp_url: comment.author.pfp_url,
					username: comment.author.username,
				}}
				upvoted={!!comment.viewer_context?.liked}
				upvotes={comment.reactions.likes_count}
				text={comment.text}
				level={level}
			/>
		);
	}

	return (
		<div className="flex flex-col items-center w-full pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
			<div className="flex flex-col gap-4 max-w-3xl w-full">
				<GoBack
					fallback="/chat"
					className="text-red flex items-center gap-1 group"
				>
					<ArrowLeft className="w-5 h-5 text-red group-hover:-translate-x-1 transition-transform" />
					Back to feed
				</GoBack>
				<CastCard cast={cast} expanded />
				<h2 className="text-white text-2xl font-bebas-neue">Comments</h2>
				{cast.direct_replies
					.toSorted(
						(a, b) =>
							(b as CastWithInteractionsAndConversationsRef).reactions
								.likes_count -
							(a as CastWithInteractionsAndConversationsRef).reactions
								.likes_count,
					)
					.map((comment) => renderComments(comment, 0))}
			</div>
		</div>
	);
}

function Comment(props: {
	hash: string;
	author: { pfp_url?: string; username: string };
	text: string;
	level: number;
	upvoted: boolean;
	upvotes: number;
}) {
	return (
		<div className="flex gap-2 bg-grey-800 rounded-xl p-4">
			<div className="relative flex-shrink-0 w-8 h-8">
				<img
					key={props.author.pfp_url}
					src={props.author.pfp_url}
					className="w-full h-full rounded-full object-cover object-center"
				/>
				{props.level > 0 ? (
					<div className="absolute -/z-10 -left-[33.25px] -top-2">
						<svg
							width={26.5}
							viewBox="-2 -2 54 55"
							fill="none"
							// onClick={() => {
							// 	//close thread
							// }}
							className={twMerge(
								"stroke-grey-200 stroke-[4.5px] hover:stroke-white transition-colors",
								`toggle-thread-${props.hash}`,
							)}
						>
							<path d="M50 50C50 50 27.7376 50.1002 14 36.5C0.123674 22.7624 0.499989 0 0.499989 0" />
						</svg>
					</div>
				) : null}
			</div>
			<div className="flex flex-col gap-2 w-full">
				<div className="flex flex-col gap-1">
					<p className="text-white"> {props.author.username}</p>
					<p className="text-white">{props.text}</p>
				</div>
				<div className="flex items-center gap-2">
					<Upvote hash={props.hash} upvoted={props.upvoted} />
					<p className="cursor-default text-sm">
						{props.upvotes} upvote
						{props.upvotes === 1 ? "" : "s"}
					</p>
				</div>
			</div>
			<MoreHorizontal className="w-5 h-5 text-grey-200 hover:text-white transition-colors mr-2" />
		</div>
	);
}
