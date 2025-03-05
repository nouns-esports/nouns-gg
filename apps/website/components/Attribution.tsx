import { Diamond } from "lucide-react";
import Link from "./Link";
import type { db } from "~/packages/db";

export default function Attribution(props: {
	id: string;
	creator: NonNullable<Awaited<ReturnType<typeof db.query.nexus.findFirst>>>;
}) {
	return (
		<Link
			href={`/users/${props.creator.username ?? props.creator.discord ?? props.creator.id}`}
			className="relative rounded-md w-full h-full flex drop-shadow-lg overflow-hidden bg-gradient-to-br from-[#F3B5FD] to-[#F66FD0] group/tag text-white font-semibold items-center"
		>
			<img
				alt={props.creator.name}
				src={props.creator.image}
				draggable={false}
				className="h-full select-none"
			/>
			<p className="w-full h-full z-10 relative px-2 flex items-center">
				{props.creator.name}
			</p>

			<div className="absolute top-0 left-0 w-full h-full bg-transparent group-hover/tag:bg-black/15 transition-colors z-10" />
		</Link>
	);
}
