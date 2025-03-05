"use client";

import { ChevronDown, ImageIcon, X } from "lucide-react";
import { Modal, useModal } from "../Modal";
import type { AuthenticatedUser } from "@/server/queries/users";
import Button from "../Button";
import LimitMeter from "../LimitMeter";
import { useState } from "react";
import type { Community } from "~/packages/db/schema/public";
import { twMerge } from "tailwind-merge";
import CastText, { useCastTextEditor } from "../CastText";

export default function CreatePostModal(props: {
	user?: AuthenticatedUser;
	communities: Community[];
}) {
	const { close } = useModal("create-post");

	const [text, setText] = useState("");

	const editor = useCastTextEditor({
		onUpdate: ({ editor }) => setText(editor.getText()),
	});

	const [community, setCommunity] = useState<Community>();

	const [image, setImage] = useState<File>();
	const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);

	if (!props.user?.nexus) return;

	return (
		<Modal
			id="create-post"
			queryParam={["post", "true"]}
			className="p-4 flex flex-col w-full max-w-[700px] gap-4"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Create a post
				</p>
				<button
					onClick={close}
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</button>
			</div>
			<div className="flex gap-3 w-full min-h-96 h-full bg-grey-800 rounded-xl pl-2 pr-4 py-4">
				<img
					alt={props.user.nexus.name}
					src={props.user.nexus.image}
					className="ml-2 w-12 h-12 flex-shrink-0 flex rounded-full object-cover object-center"
				/>
				<div className="flex flex-col gap-1 flex-1 min-w-0 w-full">
					<div className="flex items-center gap-2">
						<h2 className="text-white text-nowrap py-0.5">
							{props.user.nexus.name}
						</h2>
						{community ? (
							<>
								<p className="text-grey-200 font-semibold text-sm">in</p>
								<div className="flex relative z-10 items-center gap-1 bg-grey-600 rounded-full px-2 py-1">
									<img
										alt={community.name}
										src={community.image}
										className="w-4 h-4 rounded-full object-cover object-center"
									/>
									<h2 className="text-white text-nowrap text-sm">
										{community.name}
									</h2>
								</div>
							</>
						) : null}
					</div>
					<div className="relative">
						{text.length < 1 ? (
							<p className="absolute top-0 left-0 text-grey-200">
								Start typing a new post here...
							</p>
						) : null}
						<CastText editor={editor} />
					</div>
				</div>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div
						onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
						className="relative flex items-center gap-2 bg-grey-800 hover:bg-grey-600 cursor-pointer transition-colors p-2 pr-3 text-white rounded-full"
					>
						<img
							alt={community?.name ?? "Nouns Esports"}
							src={community?.image ?? "/logo/logo-square.svg"}
							className="rounded-full w-6 h-6"
						/>
						{community?.name ?? "Nouns Esports"}
						<ChevronDown
							className={twMerge(
								"w-4 h-4 text-white",
								showCommunityDropdown && "rotate-180",
							)}
						/>
						{showCommunityDropdown ? (
							<div className="absolute top-12 left-0 bg-grey-600 w-40 flex flex-col rounded-xl overflow-hidden">
								<div
									onClick={() => setShowCommunityDropdown(false)}
									className="fixed top-0 left-0 w-full h-full"
								/>
								{[
									{
										name: "Nouns Esports",
										id: "nouns-esports",
										channel: "nouns-esports",
										parent: null,
										image: "/logo/logo-square.svg",
									},
									...props.communities,
								].map((c) =>
									c.id !== community?.id ? (
										<div
											onClick={() => {
												if (c.id === "nouns-esports") {
													setCommunity(undefined);
													setShowCommunityDropdown(false);
													return;
												}

												setCommunity(c);
												setShowCommunityDropdown(false);
											}}
											key={c.id}
											className="flex items-center gap-2 text-nowrap w-full cursor-pointer hover:bg-grey-500 transition-colors p-2"
										>
											<img
												alt={c.name}
												src={c.image}
												className="w-6 h-6 rounded-full"
											/>
											{c.name}
										</div>
									) : null,
								)}
							</div>
						) : null}
					</div>
					<button className="p-2.5 rounded-full bg-grey-800 hover:bg-grey-600 transition-colors">
						<ImageIcon className="w-5 h-5 text-grey-200" />
					</button>
				</div>
				<div className="flex items-center gap-4">
					<LimitMeter
						type="character"
						value={new TextEncoder().encode(text).length}
						min={0}
						max={320}
					/>
					<Button size="sm">Post</Button>
				</div>
			</div>
		</Modal>
	);
}
