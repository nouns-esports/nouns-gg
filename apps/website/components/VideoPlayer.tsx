"use client";

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
import * as Player from "@livepeer/react/player";
import type parseCastEmbeds from "@/utils/parseCastEmbeds";
import Spinner from "./Spinner";

export default function VideoPlayer(props: {
	url: NonNullable<ReturnType<typeof parseCastEmbeds>["video"]>["url"];
}) {
	console.log(props.url);
	return (
		<Player.Root
			src={[
				{
					type: "hls",
					src: props.url as `${string}m3u8`,
					mime: null,
					width: null,
					height: null,
				},
			]}
			volume={0}
		>
			<Player.Container className="bg-[black] rounded-xl group overflow-hidden relative z-10">
				<Player.Video title="Video" className="w-full h-full" />
				<Player.LoadingIndicator className="w-full h-full flex items-center justify-center">
					<Spinner className="text-white" />
				</Player.LoadingIndicator>
				<Player.Controls
					className="pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 transition-opacity duration-150"
					autoHide={0}
				>
					<div className="absolute left-4 bottom-4 flex flex-col gap-2 w-[calc(100%_-_32px)]">
						<Player.Seek className="h-5 flex items-center gap-2.5 select-none touch-none">
							<Player.Track className="bg-white/70 relative flex-grow rounded-full h-1">
								<Player.SeekBuffer className="absolute bg-black/50 rounded-full h-full" />
								<Player.Range className="absolute bg-white rounded-full h-full" />
							</Player.Track>
							<Player.Thumb className="block w-3 h-3 cursor-pointer bg-white rounded-full" />
						</Player.Seek>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<Player.PlayPauseTrigger>
									<Player.PlayingIndicator matcher={false}>
										<Play className="text-white h-6 w-6" weight="fill" />
									</Player.PlayingIndicator>
									<Player.PlayingIndicator>
										<Pause className="text-white h-6 w-6" weight="fill" />
									</Player.PlayingIndicator>
								</Player.PlayPauseTrigger>
								<Player.MuteTrigger className="w-6 h-6">
									<Player.VolumeIndicator matcher={false}>
										<SpeakerSimpleX
											className="text-white h-6 w-6"
											weight="fill"
										/>
									</Player.VolumeIndicator>
									<Player.VolumeIndicator matcher={true}>
										<SpeakerSimpleHigh
											className="text-white h-6 w-6"
											weight="fill"
										/>
									</Player.VolumeIndicator>
								</Player.MuteTrigger>
								<Player.Volume className="relative flex flex-grow h-5 items-center max-w-24 w-24 touch-none select-none">
									<Player.Track className="bg-white/70 relative flex-grow rounded-full h-1">
										<Player.Range className="absolute bg-white rounded-full h-full" />
									</Player.Track>
									<Player.Thumb className="block w-3 h-3 cursor-pointer bg-white rounded-full" />
								</Player.Volume>
							</div>
							<Player.FullscreenTrigger>
								<Player.FullscreenIndicator matcher={false}>
									<CornersOut className="text-white h-7 w-7" weight="bold" />
								</Player.FullscreenIndicator>
								<Player.FullscreenIndicator matcher={true}>
									<CornersIn className="text-white h-7 w-7" weight="bold" />
								</Player.FullscreenIndicator>
							</Player.FullscreenTrigger>
						</div>
					</div>
				</Player.Controls>
			</Player.Container>
		</Player.Root>
	);
}
