"use client";

import { pinImage } from "@/server/mutations/pinImage";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { toast } from "./Toasts";
import Shimmer from "./Shimmer";
import { Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Spinner from "./Spinner";

export default function PinImage(props: {
	image?: string;
	setImage: Dispatch<SetStateAction<string | undefined>>;
}) {
	const pinImageAction = useAction(pinImage);

	async function upload(event: ChangeEvent<HTMLInputElement>) {
		props.setImage(undefined);

		const files = event.target.files;

		if (files && files.length > 0) {
			const file = files[0];

			if (file.size > 10 * 1024 * 1024) {
				return toast.error("Image size should be less than 10 MB");
			}

			const formData = new FormData();
			formData.append("file", file);

			const hash = await pinImageAction.executeAsync({ formData });

			event.target.value = "";

			if (!hash?.data || hash?.serverError) {
				return toast.error("Could not upload image");
			}

			props.setImage(`https://ipfs.nouns.gg/ipfs/${hash.data}`);
		}
	}

	return (
		<label className="relative flex items-center justify-center bg-grey-800 rounded-xl text-grey-400 border-grey-600 border-[1px] aspect-video cursor-pointer w-full hover:bg-grey-600 transition-colors">
			{!props.image ? (
				<p className="flex items-center gap-1">
					Upload Image
					{pinImageAction.isPending ? (
						<Spinner className="w-4 h-4 text-grey-400" />
					) : (
						<Plus className="w-4 h-4" />
					)}
				</p>
			) : null}
			<input
				type="file"
				accept="image/*"
				onChange={upload}
				className="hidden"
			/>
			{props.image ? (
				<div className="absolute w-full h-full p-2">
					<Shimmer className="rounded-xl w-full h-full" />
				</div>
			) : null}
			{props.image ? (
				<div className="absolute top-0 left-0 w-full h-full p-2">
					<img
						alt="Upload proposal cover"
						src={props.image}
						className="w-full h-full object-cover rounded-xl overflow-hidden"
					/>
				</div>
			) : null}
		</label>
	);
}
