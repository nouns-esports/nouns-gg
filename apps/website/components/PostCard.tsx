import {
	ArrowFatDown,
	ArrowFatUp,
	CornersIn,
	CornersOut,
	Pause,
	Play,
	SpeakerHigh,
	SpeakerSimpleHigh,
	SpeakerSimpleX,
} from "phosphor-react-sc";
import Link from "./Link";
import type { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import {
	ExternalLink,
	MessageSquare,
	MoreHorizontal,
	RefreshCcw,
} from "lucide-react";
import parseCastEmbeds from "@/utils/parseCastEmbeds";
import * as Player from "@livepeer/react/player";
import Spinner from "./Spinner";
import { twMerge } from "tailwind-merge";
import Countup from "./Countup";
import Recast from "./Recast";
import Upvote from "./Upvote";
import type { getPosts } from "@/server/queries/posts";
import TipTap from "./TipTap";
import VideoPlayer from "./VideoPlayer";

export default function PostCard(props: {
	post: NonNullable<Awaited<ReturnType<typeof getPosts>>>[number];
	expanded?: boolean;
}) {
	const embeds = parseCastEmbeds(props.post);

	const text = parseCastText(props.post);

	return (
		<div className="relative flex gap-3 bg-grey-800 hover:bg-grey-600 transition-colors rounded-xl pl-2 pr-4 py-4 w-full">
			{!props.expanded ? (
				<Link
					href={`https://warpcast.com/${props.post.creator.username}/${props.post.hash.substring(0, 10)}`}
					newTab
					className="absolute top-0 left-0 w-full h-full"
				/>
			) : null}
			<Link
				href={`https://warpcast.com/${props.post.creator.username}`}
				newTab
				className="relative z-10 ml-2 w-12 h-12 flex-shrink-0 flex"
			>
				<img
					alt={props.post.creator.displayName ?? ""}
					key={props.post.creator.pfpUrl}
					src={props.post.creator.pfpUrl ?? undefined}
					className="w-full h-full rounded-full object-cover object-center hover:brightness-75 transition-all"
				/>
			</Link>
			<div className="flex flex-col gap-1 flex-1 min-w-0">
				<div className="flex justify-between">
					<div className="flex items-center gap-2">
						<Link
							newTab
							href={`https://warpcast.com/${props.post.creator.username}`}
							className="flex relative z-10 gap-2 items-center w-min hover:opacity-70 transition-opacity"
						>
							<h2 className="text-white text-nowrap">
								{props.post.creator.displayName}
							</h2>
						</Link>
						{props.post.community ? (
							<>
								<p className="text-grey-200 font-semibold text-sm">in</p>
								<Link
									href={`/c/${props.post.community.handle}`}
									className="flex relative z-10  items-center gap-1 bg-grey-600 hover:bg-grey-500 transition-colors rounded-full px-2 py-1"
								>
									<img
										alt={props.post.community.name}
										key={props.post.community.image}
										src={props.post.community.image}
										className="w-4 h-4 rounded-full object-cover object-center"
									/>
									<h2 className="text-white text-nowrap text-sm">
										{props.post.community.name}
									</h2>
								</Link>
							</>
						) : null}
						<p className="text-grey-200 font-semibold text-sm pointer-events-none">
							<Countup date={props.post.createdAt} />
						</p>
					</div>
					{/* <MoreHorizontal className="w-5 h-5 text-grey-200 hover:text-white transition-colors mr-2" /> */}
				</div>
				<div className="flex flex-col gap-3 w-full">
					<TipTap content={text} className="text-white w-full" />
					<div className="flex flex-col gap-1">
						{embeds.image ? <CastImage image={embeds.image} /> : ""}
						{/* {embeds.website ? (
							<WebsitePreview
								website={embeds.website}
								small={(props.post.embeds?.length ?? 0) > 0}
							/>
						) : null}
					
						 */}
						{props.post.quotedPosts
							? props.post.quotedPosts.map((quotedPost) => (
									<QuoteCast
										key={quotedPost.hash}
										quoteCast={quotedPost}
										small={
											!!embeds.image || !!embeds.video || !!props.post.round
										}
									/>
								))
							: null}
						{embeds.video ? <VideoPlayer video={embeds.video} /> : null}
						{props.post.round ? (
							<RoundPreview round={props.post.round} />
						) : null}
					</div>
					<div
						className={twMerge(
							"flex",
							props.expanded ? "gap-2" : "flex-col gap-3",
						)}
					>
						{/* <div
							className={twMerge(
								"flex items-center gap-3",
								props.expanded && "gap-2",
							)}
						>
							{!props.expanded ? (
								<Link
									href={`https://warpcast.com/${props.post.creator.username}/${props.post.hash.substring(0, 10)}`}
									className="relative z-10"
								>
									<MessageSquare
										className={twMerge(
											"w-5 h-5 text-grey-200 hover:text-white transition-colors  ",
										)}
									/>
								</Link>
							) : null}
							<Recast hash={props.post.hash} recast={false} />
							{props.expanded ? (
								<p className="cursor-default mr-2">
									{props.post.recastsCount} repost
									{props.post.recastsCount === 1 ? "" : "s"}
								</p>
							) : null}
							<Upvote hash={props.post.hash} upvoted={false} />
						</div> */}

						<div className="flex items-center gap-2 text-sm text-grey-200">
							<p className="cursor-default">
								{props.post.likesCount} upvote
								{props.post.likesCount === 1 ? "" : "s"}
							</p>
							{!props.expanded ? (
								<Link
									href={`https://warpcast.com/${props.post.creator.username}/${props.post.hash.substring(0, 10)}`}
									newTab
									className="relative z-10 hover:text-grey-200/70 transition-colors"
								>
									{props.post.commentsCount} comment
									{props.post.commentsCount === 1 ? "" : "s"}
								</Link>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function parseCastText(
	post:
		| NonNullable<Awaited<ReturnType<typeof getPosts>>>[number]
		| NonNullable<
				Awaited<ReturnType<typeof getPosts>>[number]["quotedPosts"]
		  >[number],
) {
	let text = post.text;

	// Remove embedded URLs from text
	if (post.text && post.embeddedUrls) {
		text = post.embeddedUrls.reduce(
			(text, url) => text.replace(url, "").trim(),
			post.text,
		);
	}

	// Remove embedded cast URLs from text
	if (post.text && post.embeddedCasts) {
		text = post.embeddedCasts.reduce((text, castHash) => {
			const hashPrefix = castHash.substring(0, 10);
			// remove any urls containing this hash prefix in text
			return text.replace(
				new RegExp(`https?://[^\\s]*${hashPrefix}[^\\s]*`, "g"),
				"",
			);
		}, text);
	}

	if (
		post.mentions !== null &&
		post.mentionedProfiles !== null &&
		post.mentionsPositions !== null &&
		post.mentionsPositions.length === post.mentionedProfiles.length
	) {
		for (let i = 0; i < post.mentionsPositions.length; i++) {
			const bytePosition = post.mentionsPositions[i];
			const username = post.mentionedProfiles[i].username;

			if (username) {
				// Convert byte position to character position
				let charPosition = 0;
				let currentBytePos = 0;

				for (let j = 0; j < post.text.length; j++) {
					if (currentBytePos >= bytePosition) {
						charPosition = j;
						break;
					}
					// Count bytes for the current character
					const charCode = post.text.charCodeAt(j);
					if (charCode <= 0x7f) {
						currentBytePos += 1; // ASCII character (1 byte)
					} else if (charCode <= 0x7ff) {
						currentBytePos += 2; // 2-byte character
					} else if (charCode <= 0xffff) {
						currentBytePos += 3; // 3-byte character
					} else {
						currentBytePos += 4; // 4-byte character
					}
				}

				const before = post.text.slice(0, charPosition);
				const after = post.text.slice(charPosition);

				text = before + `@${username} ` + after;
			}
		}
	}

	return text;
}

// function WebsitePreview(props: {
// 	website: NonNullable<ReturnType<typeof parseCastEmbeds>["website"]>;
// 	small?: boolean;
// }) {
// 	if (props.small) {
// 		return (
// 			<Link
// 				href={props.website.url}
// 				newTab
// 				className="relative z-10 h-24 border bg-black/20 hover:bg-grey-800 transition-colors border-grey-600 flex gap-3 rounded-xl p-2 group"
// 			>
// 				<img
// 					alt={props.website.title}
// 					key={props.website.image}
// 					src={props.website.image}
// 					className="h-full aspect-[4/3] rounded-xl group-hover:brightness-75 object-cover object-center transition-all"
// 				/>
// 				<div className="w-full flex flex-col gap-1 pointer-events-none">
// 					<p className="flex items-center w-full text-white">
// 						{props.website.title}
// 					</p>
// 					<p className="flex items-center w-full text-sm text-grey-200">
// 						{props.website.url}
// 					</p>
// 				</div>
// 				<ExternalLink className="w-4 h-4 text-white flex-shrink-0 mt-1 mr-1" />
// 			</Link>
// 		);
// 	}

// 	return (
// 		<Link
// 			href={props.website.url}
// 			newTab
// 			className="relative z-10 aspect-video bg-black flex flex-col rounded-xl overflow-hidden group"
// 		>
// 			<img
// 				alt={props.website.title}
// 				key={props.website.image}
// 				src={props.website.image}
// 				className="w-full h-full group-hover:brightness-75 object-cover object-center transition-all"
// 			/>
// 			<p className="flex items-center gap-2 pointer-events-none absolute bottom-2 left-2 text-white text-sm bg-black/70 rounded-md py-1 px-2">
// 				{props.website.title}
// 				<ExternalLink className="w-4 h-4" />
// 			</p>
// 		</Link>
// 	);
// }

function CastImage(props: {
	image: NonNullable<ReturnType<typeof parseCastEmbeds>["image"]>;
}) {
	return (
		<div className="relative z-10 flex items-center justify-center mb-1 border border-grey-600 w-full overflow-hidden rounded-xl">
			<img
				alt={props.image}
				src={props.image}
				className="blur-2xl brightness-[25%] absolute top-0 left-0 w-full object-cover h-full"
			/>
			<img
				alt={props.image}
				src={props.image}
				// style={{
				// 	height: props.image.height,
				// }}
				className="relative z-10 object-contain h-full max-h-[400px]"
			/>
		</div>
	);
}

function QuoteCast(props: {
	quoteCast: NonNullable<
		Awaited<ReturnType<typeof getPosts>>[number]["quotedPosts"]
	>[number];
	small?: boolean;
}) {
	const text = parseCastText(props.quoteCast);
	const embeds = parseCastEmbeds(props.quoteCast);

	return (
		<div className="relative z-10 rounded-xl flex flex-col border bg-black/20 hover:bg-grey-800 transition-colors border-grey-600 p-2 mb-1">
			<Link
				href={`https://warpcast.com/${props.quoteCast.creator?.username}/${props.quoteCast.hash.substring(0, 10)}`}
				className="w-full h-full absolute top-0 left-0"
			/>
			{props.quoteCast.creator ? (
				<Link
					href={`/users/${props.quoteCast.creator.username}`}
					className="relative z-10 flex items-center gap-2 group w-fit"
				>
					<img
						alt={props.quoteCast.creator.displayName ?? ""}
						src={props.quoteCast.creator.pfpUrl ?? ""}
						className="w-4 h-4 rounded-full object-cover object-center group-hover:brightness-75 transition-all"
					/>
					<p className="text-white group-hover:opacity-70 transition-opacity text-nowrap">
						{props.quoteCast.creator.displayName}
					</p>
				</Link>
			) : null}
			<div
				className={twMerge(
					"flex justify-between gap-2",
					!props.small && "flex-col",
				)}
			>
				{text ? <TipTap content={text} className="text-white text-sm" /> : null}
				{embeds.image ? (
					<img
						alt={embeds.image}
						src={embeds.image}
						className={twMerge(
							"flex h-full aspect-video w-full rounded-xl object-cover object-center",
							props.small && "w-32",
						)}
					/>
				) : null}
			</div>
		</div>
	);
}

function RoundPreview(props: {
	round: NonNullable<Awaited<ReturnType<typeof getPosts>>[number]["round"]>;
}) {
	return (
		<Link
			href={`/rounds/${props.round.handle}`}
			newTab
			className="relative z-10 aspect-video bg-black/20 hover:bg-grey-800 transition-colors border border-grey-600 rounded-xl overflow-hidden group"
		>
			<img
				src={props.round.image}
				alt={props.round.name}
				className="w-full h-full object-cover group-hover:brightness-75 transition-all"
			/>
			<p className="text-white text-sm absolute bottom-2 left-2 bg-black/70 rounded-md py-1 px-2">
				{props.round.name}
			</p>
		</Link>
	);
}
