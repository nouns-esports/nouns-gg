import Link from "./Link";
import { MoreHorizontal } from "lucide-react";
import parseCastEmbeds from "@/utils/parseCastEmbeds";
import { twMerge } from "tailwind-merge";
import Countup from "./Countup";
import type { getPosts } from "@/server/queries/posts";
import VideoPlayer from "./VideoPlayer";
import PostText from "./PostText";

export default function PostCard(props: {
	post: NonNullable<Awaited<ReturnType<typeof getPosts>>>[number];
	expanded?: boolean;
}) {
	const embeds = parseCastEmbeds(props.post.embeds);

	return (
		<div className="relative flex gap-3 bg-grey-800 rounded-xl pl-2 pr-4 py-4 w-full">
			{!props.expanded ? (
				<Link
					href={`https://farcaster.xyz/${props.post.author.username}/${props.post.hash.substring(0, 10)}`}
					className="w-full h-full absolute top-0 left-0"
				/>
			) : null}
			<Link
				href={`https://farcaster.xyz/${props.post.author.username}`}
				newTab
				className="relative z-10 ml-2 w-12 h-12 flex-shrink-0 flex"
			>
				<img
					alt={props.post.author.display_name}
					key={props.post.author.pfp_url}
					src={props.post.author.pfp_url}
					className="w-full h-full rounded-full object-cover object-center hover:brightness-75 transition-all"
				/>
			</Link>
			<div className="flex flex-col gap-1 flex-1 min-w-0">
				<div className="flex justify-between">
					<div className="flex items-center gap-2">
						<Link
							newTab
							href={`https://farcaster.xyz/${props.post.author.username}`}
							className="flex relative z-10 gap-2 items-center w-min hover:opacity-70 transition-opacity"
						>
							<h2 className="text-white text-nowrap">
								{props.post.author.display_name}
							</h2>
						</Link>
						{props.post.channel ? (
							<>
								<p className="text-grey-200 font-semibold text-sm">in</p>
								<Link
									href={`https://farcaster.xyz/~/channel/${props.post.channel.id}`}
									className="flex relative z-10  items-center gap-1 bg-grey-600 hover:bg-grey-500 transition-colors rounded-full px-2 py-1"
								>
									<img
										alt={props.post.channel.name}
										key={props.post.channel.image_url}
										src={props.post.channel.image_url}
										className="w-4 h-4 rounded-full object-cover object-center"
									/>
									<h2 className="text-white text-nowrap text-sm">
										{props.post.channel.name}
									</h2>
								</Link>
							</>
						) : null}
						<p className="text-grey-200 font-semibold text-sm pointer-events-none">
							<Countup date={props.post.timestamp} />
						</p>
					</div>
					<MoreHorizontal className="w-5 h-5 text-grey-200 hover:text-white transition-colors mr-2" />
				</div>
				<div className="flex flex-col gap-3 w-full">
					<PostText className="text-white w-full">{props.post.text}</PostText>
					<div className="flex flex-col gap-1">
						{embeds.image ? <CastImage image={embeds.image} /> : ""}
						{embeds.website ? (
							<WebsitePreview website={embeds.website} />
						) : null}
						{embeds.video ? <VideoPlayer url={embeds.video.url} /> : null}
						{embeds.quoteCast ? (
							<QuoteCast
								quoteCast={embeds.quoteCast}
								small={props.post.embeds.length > 0}
							/>
						) : null}
					</div>
					<div
						className={twMerge(
							"flex",
							props.expanded ? "gap-2" : "flex-col gap-3",
						)}
					>
						<div className="flex items-center gap-2 text-sm text-grey-200">
							{!props.expanded ? (
								<Link
									href={`https://farcaster.xyz/${props.post.author.username}/${props.post.hash.substring(0, 10)}`}
									className="relative z-10 hover:text-grey-200/70 transition-colors"
								>
									{props.post.replies.count} comment
									{props.post.replies.count === 1 ? "" : "s"}
								</Link>
							) : null}
							<p className="cursor-default">
								{props.post.reactions.likes_count} upvote
								{props.post.reactions.likes_count === 1 ? "" : "s"}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function WebsitePreview(props: {
	website: NonNullable<ReturnType<typeof parseCastEmbeds>["website"]>;
}) {
	return (
		<Link
			href={props.website.url}
			newTab
			className="relative z-10 aspect-video bg-black/20 hover:bg-grey-800 transition-colors border border-grey-600 rounded-xl overflow-hidden group"
		>
			<img
				src={props.website.image}
				alt={props.website.title}
				className="w-full h-full object-cover group-hover:brightness-75 transition-all"
			/>
			<p className="text-white text-sm absolute bottom-2 left-2 bg-black/70 rounded-md py-1 px-2">
				{props.website.title}
			</p>
		</Link>
	);
}

function CastImage(props: {
	image: NonNullable<ReturnType<typeof parseCastEmbeds>["image"]>;
}) {
	return (
		<div className="relative z-10 flex items-center justify-center mb-1 border border-grey-600 w-full overflow-hidden rounded-xl">
			<img
				alt={props.image.url}
				src={props.image.url}
				className="blur-2xl brightness-[25%] absolute top-0 left-0 w-full object-cover h-full"
			/>
			<img
				alt={props.image.url}
				src={props.image.url}
				style={{
					height: props.image.height,
				}}
				className="relative z-10 object-contain h-full max-h-[400px]"
			/>
		</div>
	);
}

function QuoteCast(props: {
	quoteCast: NonNullable<ReturnType<typeof parseCastEmbeds>["quoteCast"]>;
	small?: boolean;
}) {
	return (
		<div className="relative z-10 rounded-xl flex flex-col gap-1 border bg-black/20 hover:bg-grey-800 transition-colors border-grey-600 p-2 mb-1">
			<Link
				href={`/chat/${props.quoteCast.cast.hash.substring(0, 10)}`}
				className="w-full h-full absolute top-0 left-0"
			/>
			<Link
				href={`/users/${props.quoteCast.cast.author.username}`}
				className="relative z-10 flex items-center gap-2 group w-fit"
			>
				<img
					alt={props.quoteCast.cast.author.display_name}
					src={props.quoteCast.cast.author.pfp_url}
					className="w-4 h-4 rounded-full object-cover object-center group-hover:brightness-75 transition-all"
				/>
				<p className="text-white group-hover:opacity-70 transition-opacity text-nowrap">
					{props.quoteCast.cast.author.display_name}
				</p>
			</Link>
			<div className="flex justify-between gap-1">
				{props.quoteCast.cast.text ? (
					<PostText className="text-white text-sm">
						{props.quoteCast.cast.text}
					</PostText>
				) : null}
				{props.quoteCast.embeds.image ? (
					<div
						className={twMerge(
							"flex h-full w-32 flex-shrink-0 rounded-xl overflow-hidden",
							!props.small && "w-full aspect-video",
						)}
					>
						<img
							alt={props.quoteCast.embeds.image.url}
							src={props.quoteCast.embeds.image.url}
							className="w-full h-full object-cover object-center"
						/>
					</div>
				) : null}
			</div>
		</div>
	);
}
