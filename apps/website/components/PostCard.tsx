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
import CastText from "./CastText";
import type { getPosts } from "@/server/queries/posts";

export default function PostCard(props: {
	post: NonNullable<Awaited<ReturnType<typeof getPosts>>>[number];
	expanded?: boolean;
}) {
	const embeds = parseCastEmbeds(props.post);

	const text =
		props.post.text && props.post.embeddedUrls
			? props.post.embeddedUrls.reduce(
					(text, url) => text.replace(url, "").trim(),
					props.post.text,
				)
			: props.post.text;

	return (
		<div className="relative flex gap-3 bg-grey-800 hover:bg-grey-600 transition-colors rounded-xl pl-2 pr-4 py-4 w-full">
			{!props.expanded ? (
				<Link
					href={`https://warpcast.com/${props.post.creator.username}/${props.post.hash.substring(0, 10)}`}
					newTab
					className="w-full h-full absolute top-0 left-0"
				/>
			) : null}
			<Link
				href={`/users/${props.post.creator.username}`}
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
							href={`/users/${props.post.creator.username}`}
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
					<CastText className="text-white w-full pointer-events-none">
						{text}
					</CastText>
					<div className="flex flex-col gap-1">
						{embeds.image ? <CastImage image={embeds.image} /> : ""}
						{/* {embeds.website ? (
							<WebsitePreview
								website={embeds.website}
								small={(props.post.embeds?.length ?? 0) > 0}
							/>
						) : null}
						{embeds.video ? <VideoPlayer video={embeds.video} /> : null}
						{embeds.quoteCast ? (
							<QuoteCast
								quoteCast={embeds.quoteCast}
								small={props.cast.embeds.length > 0}
							/>
						) : null} */}
						{embeds.round ? <RoundPreview round={embeds.round} /> : null}
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

// function VideoPlayer(props: {
// 	video: NonNullable<ReturnType<typeof parseCastEmbeds>["video"]>;
// }) {
// 	return (
// 		<Player.Root
// 			src={[
// 				{
// 					type: "hls",
// 					src: props.video.url as `${string}m3u8`,
// 					mime: null,
// 					width: null,
// 					height: null,
// 				},
// 			]}
// 			volume={0}
// 		>
// 			<Player.Container className="bg-[black] rounded-xl group overflow-hidden">
// 				<Player.Video title="Agent 327" className="w-full h-full" />
// 				<Player.LoadingIndicator className="w-full h-full flex items-center justify-center">
// 					<Spinner className="text-white" />
// 				</Player.LoadingIndicator>
// 				<Player.Controls
// 					className="pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 transition-opacity duration-150"
// 					autoHide={0}
// 				>
// 					<div className="absolute left-4 bottom-4 flex flex-col gap-2 w-[calc(100%_-_32px)]">
// 						<Player.Seek className="h-5 flex items-center gap-2.5 select-none touch-none">
// 							<Player.Track className="bg-white/70 relative flex-grow rounded-full h-1">
// 								<Player.SeekBuffer className="absolute bg-black/50 rounded-full h-full" />
// 								<Player.Range className="absolute bg-white rounded-full h-full" />
// 							</Player.Track>
// 							<Player.Thumb className="block w-3 h-3 cursor-pointer bg-white rounded-full" />
// 						</Player.Seek>
// 						<div className="flex items-center justify-between">
// 							<div className="flex items-center gap-4">
// 								<Player.PlayPauseTrigger>
// 									<Player.PlayingIndicator matcher={false}>
// 										<Play className="text-white h-6 w-6" weight="fill" />
// 									</Player.PlayingIndicator>
// 									<Player.PlayingIndicator>
// 										<Pause className="text-white h-6 w-6" weight="fill" />
// 									</Player.PlayingIndicator>
// 								</Player.PlayPauseTrigger>
// 								<Player.MuteTrigger className="w-6 h-6">
// 									<Player.VolumeIndicator matcher={false}>
// 										<SpeakerSimpleX
// 											className="text-white h-6 w-6"
// 											weight="fill"
// 										/>
// 									</Player.VolumeIndicator>
// 									<Player.VolumeIndicator matcher={true}>
// 										<SpeakerSimpleHigh
// 											className="text-white h-6 w-6"
// 											weight="fill"
// 										/>
// 									</Player.VolumeIndicator>
// 								</Player.MuteTrigger>
// 								<Player.Volume className="relative flex flex-grow h-5 items-center max-w-24 w-24 touch-none select-none">
// 									<Player.Track className="bg-white/70 relative flex-grow rounded-full h-1">
// 										<Player.Range className="absolute bg-white rounded-full h-full" />
// 									</Player.Track>
// 									<Player.Thumb className="block w-3 h-3 cursor-pointer bg-white rounded-full" />
// 								</Player.Volume>
// 							</div>
// 							<Player.FullscreenTrigger>
// 								<Player.FullscreenIndicator matcher={false}>
// 									<CornersOut className="text-white h-7 w-7" weight="bold" />
// 								</Player.FullscreenIndicator>
// 								<Player.FullscreenIndicator matcher={true}>
// 									<CornersIn className="text-white h-7 w-7" weight="bold" />
// 								</Player.FullscreenIndicator>
// 							</Player.FullscreenTrigger>
// 						</div>
// 					</div>
// 				</Player.Controls>
// 			</Player.Container>
// 		</Player.Root>
// 	);
// }

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

// function QuoteCast(props: {
// 	quoteCast: NonNullable<ReturnType<typeof parseCastEmbeds>["quoteCast"]>;
// 	small?: boolean;
// }) {
// 	return (
// 		<div className="relative z-10 rounded-xl flex flex-col gap-1 border bg-black/20 hover:bg-grey-800 transition-colors border-grey-600 p-2 mb-1">
// 			<Link
// 				href={`/chat/${props.quoteCast.cast.hash.substring(0, 10)}`}
// 				className="w-full h-full absolute top-0 left-0"
// 			/>
// 			<Link
// 				href={`/users/${props.quoteCast.cast.author.username}`}
// 				className="relative z-10 flex items-center gap-2 group w-fit"
// 			>
// 				<img
// 					alt={props.quoteCast.cast.author.display_name}
// 					src={props.quoteCast.cast.author.pfp_url}
// 					className="w-4 h-4 rounded-full object-cover object-center group-hover:brightness-75 transition-all"
// 				/>
// 				<p className="text-white group-hover:opacity-70 transition-opacity text-nowrap">
// 					{props.quoteCast.cast.author.display_name}
// 				</p>
// 			</Link>
// 			<div className="flex justify-between gap-1">
// 				{props.quoteCast.cast.text ? (
// 					<CastText className="text-white text-sm">
// 						{props.quoteCast.cast.text}
// 					</CastText>
// 				) : null}
// 				{props.quoteCast.embeds.image ? (
// 					<div
// 						className={twMerge(
// 							"flex h-full w-32 flex-shrink-0 rounded-xl overflow-hidden",
// 							!props.small && "w-full aspect-video",
// 						)}
// 					>
// 						<img
// 							alt={props.quoteCast.embeds.image.url}
// 							src={props.quoteCast.embeds.image.url}
// 							className="w-full h-full object-cover object-center"
// 						/>
// 					</div>
// 				) : null}
// 			</div>
// 		</div>
// 	);
// }

function RoundPreview(props: {
	round: NonNullable<ReturnType<typeof parseCastEmbeds>["round"]>;
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
