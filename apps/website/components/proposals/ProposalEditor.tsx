"use client";

import { useMemo, useState } from "react";
import TextInput from "../form/TextInput";
import Button from "../Button";
import { createProposal } from "@/server/mutations/createProposal";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useRouter } from "next/navigation";
import LimitMeter from "../LimitMeter";
import { updateProposal } from "@/server/mutations/updateProposal";
import dynamic from "next/dynamic";
import Shimmer from "../Shimmer";
import { useAction } from "next-safe-action/hooks";
import type { getRoundWithProposal } from "@/server/queries/rounds";
import { Trash2 } from "lucide-react";
import PinImage from "../PinImage";
import VideoPlayer from "../VideoEmbedPlayer";
import { videoEmbedFromLink, isVideoEmbed } from "@/utils/videoEmbeds";
import { toast } from "../Toasts";

const Markdown = dynamic(() => import("../lexical/Markdown"), {
	ssr: false,
	loading: () => <Shimmer />,
});

export default function ProposalEditor(props: {
	round: NonNullable<Awaited<ReturnType<typeof getRoundWithProposal>>>;
	proposal?: NonNullable<
		Awaited<ReturnType<typeof getRoundWithProposal>>
	>["proposals"][number];
	user: string;
}) {
	const [title, setTitle] = useState(props.proposal?.title ?? "");
	const [image, setImage] = useState(props.proposal?.image ?? undefined);
	const [video, setVideo] = useState(props.proposal?.video ?? undefined);
	const [url, setUrl] = useState(props.proposal?.url ?? undefined);

	const validUrl = useMemo(() => {
		if (!url) return;

		try {
			const validUrl = new URL(url).toString();

			if (props.round.linkRegex) {
				const regex = new RegExp(props.round.linkRegex);
				if (!regex.test(validUrl)) return;
			}

			return validUrl;
		} catch (error) {
			return;
		}
	}, [url]);

	const validVideo = useMemo(() => {
		if (!video) return;

		if (isVideoEmbed(video)) return video;

		return videoEmbedFromLink(video);
	}, [video]);

	const [editorState, setEditorState] = useState(
		props.proposal?.content ??
			JSON.stringify({
				children: [
					{
						children: [],
						direction: null,
						format: "",
						indent: 0,
						type: "paragraph",
						version: 1,
						textFormat: 0,
					},
				],
				direction: null,
				format: "",
				indent: 0,
				type: "root",
				version: 1,
			}),
	);

	const [parsedMarkdown, setParsedMarkdown] = useState(
		props.proposal?.content ?? "",
	);

	const router = useRouter();

	const createProposalAction = useAction(createProposal);
	const updateProposalAction = useAction(updateProposal);

	console.log(
		title.length,
		props.round.minTitleLength,
		props.round.maxTitleLength,
	);

	return (
		<div className="flex flex-col gap-8 w-full">
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<h2 className="font-luckiest-guy text-white text-2xl">Title</h2>
					<LimitMeter
						value={title.length}
						min={props.round.minTitleLength}
						max={props.round.maxTitleLength}
					/>
				</div>
				<TextInput
					placeholder="Enter a title for your proposal"
					onChange={(value) => {
						if (value.length <= props.round.maxTitleLength) setTitle(value);
					}}
					value={title}
				/>
			</div>
			{
				{
					image: (
						<>
							<div className="flex flex-col gap-3 max-w-[400px]">
								<div className="flex items-center justify-between mt-4">
									<h2 className="font-luckiest-guy text-white text-2xl">
										Image
									</h2>
									{image ? (
										<button
											onClick={() => setImage(undefined)}
											className="text-red flex items-center gap-1 hover:opacity-70 transition-opacity"
										>
											Remove
											<Trash2 className="w-4 h-4" />
										</button>
									) : null}
								</div>
								<PinImage image={image} setImage={setImage} />
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between">
									<h2 className="font-luckiest-guy text-white text-2xl">
										Caption
									</h2>
									<LimitMeter
										value={parsedMarkdown.length}
										min={props.round.minDescriptionLength}
										max={props.round.maxDescriptionLength}
									/>
								</div>
								<div className="relative bg-grey-800 border border-grey-600 rounded-xl overflow-hidden p-2 min-h-60">
									<Markdown
										markdown={editorState}
										readOnly={false}
										onChange={(state, editor) => {
											state.read(() => {
												setEditorState(
													JSON.stringify(editor.toJSON().editorState.root),
												);
												setParsedMarkdown(
													$generateHtmlFromNodes(editor).replaceAll(
														/<[^>]*>/g,
														"",
													),
												);
											});
										}}
									/>
								</div>
							</div>
						</>
					),
					markdown: (
						<>
							<div className="flex flex-col gap-3 max-w-[400px]">
								<div className="flex items-center justify-between mt-4">
									<h2 className="font-luckiest-guy text-white text-2xl">
										Cover Image
									</h2>
									{image ? (
										<button
											onClick={() => setImage(undefined)}
											className="text-red flex items-center gap-1 hover:opacity-70 transition-opacity"
										>
											Remove
											<Trash2 className="w-4 h-4" />
										</button>
									) : null}
								</div>
								<PinImage image={image} setImage={setImage} />
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between">
									<h2 className="font-luckiest-guy text-white text-2xl">
										Proposal
									</h2>
									<LimitMeter
										value={parsedMarkdown.length}
										min={props.round.minDescriptionLength}
										max={props.round.maxDescriptionLength}
									/>
								</div>
								<div className="relative bg-grey-800 border border-grey-600 rounded-xl overflow-hidden p-2 min-h-60">
									<Markdown
										markdown={editorState}
										readOnly={false}
										onChange={(state, editor) => {
											state.read(() => {
												setEditorState(
													JSON.stringify(editor.toJSON().editorState.root),
												);
												setParsedMarkdown(
													$generateHtmlFromNodes(editor).replaceAll(
														/<[^>]*>/g,
														"",
													),
												);
											});
										}}
									/>
								</div>
							</div>
						</>
					),
					video: (
						<>
							<div className="flex flex-col gap-3 max-w-[400px]">
								<div className="flex items-center justify-between mt-4">
									<h2 className="font-luckiest-guy text-white text-2xl">
										Cover Image
									</h2>
									{image ? (
										<button
											onClick={() => setImage(undefined)}
											className="text-red flex items-center gap-1 hover:opacity-70 transition-opacity"
										>
											Remove
											<Trash2 className="w-4 h-4" />
										</button>
									) : null}
								</div>
								<PinImage image={image} setImage={setImage} />
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between max-w-[400px]">
									<h2 className="font-luckiest-guy text-white text-2xl">
										Video
									</h2>
									{video && validVideo ? (
										<button
											onClick={() => setVideo(undefined)}
											className="text-red flex items-center gap-1 hover:opacity-70 transition-opacity"
										>
											Remove
											<Trash2 className="w-4 h-4" />
										</button>
									) : null}
								</div>
								{video && validVideo ? (
									<div className="max-w-[400px]">
										<VideoPlayer url={validVideo} />
									</div>
								) : (
									<TextInput
										placeholder="Link to Twitch Clip, YouTube Video, or Google Drive File"
										onChange={(value) => setVideo(value)}
										value={video}
									/>
								)}
								{video && !validVideo ? (
									<small className="text-red">Not a valid video url</small>
								) : null}
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between">
									<h2 className="font-luckiest-guy text-white text-2xl">
										Caption
									</h2>
									<LimitMeter
										value={parsedMarkdown.length}
										min={props.round.minDescriptionLength}
										max={props.round.maxDescriptionLength}
									/>
								</div>
								<div className="relative bg-grey-800 border border-grey-600 rounded-xl overflow-hidden p-2 min-h-60">
									<Markdown
										markdown={editorState}
										readOnly={false}
										onChange={(state, editor) => {
											state.read(() => {
												setEditorState(
													JSON.stringify(editor.toJSON().editorState.root),
												);
												setParsedMarkdown(
													$generateHtmlFromNodes(editor).replaceAll(
														/<[^>]*>/g,
														"",
													),
												);
											});
										}}
									/>
								</div>
							</div>
						</>
					),
					url: (
						<>
							<div className="flex flex-col gap-3 max-w-[400px]">
								<div className="flex items-center justify-between mt-4">
									<h2 className="font-luckiest-guy text-white text-2xl">
										Cover Image
									</h2>
									{image ? (
										<button
											onClick={() => setImage(undefined)}
											className="text-red flex items-center gap-1 hover:opacity-70 transition-opacity"
										>
											Remove
											<Trash2 className="w-4 h-4" />
										</button>
									) : null}
								</div>
								<PinImage image={image} setImage={setImage} />
							</div>
							<div className="flex flex-col gap-2 max-w-[400px]">
								<h2 className="font-luckiest-guy text-white text-2xl">
									Link to Farcade Game
								</h2>
								<TextInput
									placeholder="Link to the Farcade game"
									onChange={(value) => setUrl(value)}
									value={url ?? ""}
								/>
								{url && !validUrl ? (
									<small className="text-red">Not a valid link</small>
								) : null}
							</div>
						</>
					),
				}[props.round.type]
			}
			{/* <div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<h2 className="font-luckiest-guy text-white text-2xl">Socials</h2>
				</div>
			</div> */}
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<h2 className="font-luckiest-guy text-white text-2xl">Submit</h2>
					<p>
						Double check to make sure your poposal includes all necessary
						requirements
					</p>
				</div>
				<Button
					loading={
						createProposalAction.isPending || updateProposalAction.isPending
					}
					disabled={
						createProposalAction.isPending ||
						updateProposalAction.isPending ||
						title.length < props.round.minTitleLength ||
						title.length > props.round.maxTitleLength ||
						parsedMarkdown.length < props.round.minDescriptionLength ||
						parsedMarkdown.length > props.round.maxDescriptionLength ||
						{
							markdown: false,
							image: !image,
							video: !video && !validVideo && !image,
							url: !url && !validUrl && !image,
						}[props.round.type]
					}
					onClick={async () => {
						if (!props.user) return;

						if (props.proposal) {
							const result = await updateProposalAction.executeAsync({
								round: props.round.id,
								title,
								content: parsedMarkdown.length > 0 ? editorState : undefined,
								image: image,
								video: validVideo,
								url: validUrl,
								proposal: props.proposal.id,
							});

							if (result?.serverError) {
								return toast.error(result.serverError);
							}

							toast.success("Successfully updated proposal");
							return router.push(`/rounds/${props.round.handle}`);
						}

						const result = await createProposalAction.executeAsync({
							title,
							content: parsedMarkdown.length > 0 ? editorState : undefined,
							round: props.round.id,
							image: image,
							video: validVideo,
							url: validUrl,
						});

						if (result?.serverError) {
							return toast.error(result.serverError);
						}

						if (result?.data?.earnedXP) {
							toast.xp({
								total: result.data.totalXP,
								earned: result.data.earnedXP,
							});
						}

						toast.success("Successfully created proposal");
						return router.push(`/rounds/${props.round.handle}`);
					}}
				>
					{props.proposal ? "Update Proposal" : "Create Proposal"}
				</Button>
			</div>
		</div>
	);
}
