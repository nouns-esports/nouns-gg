import type { getRaffles } from "@/server/queries/raffles";
import { User } from "lucide-react";
import Link from "./Link";

export default function RaffleCard(props: {
	raffle: NonNullable<Awaited<ReturnType<typeof getRaffles>>>[number];
}) {
	return (
		<Link
			href={`/raffles/${props.raffle.handle}`}
			className="relative flex flex-col gap-4 overflow-hidden rounded-xl bg-grey-800 p-4 transition-colors hover:bg-grey-600"
		>
			<img
				alt={props.raffle.name}
				src={`${props.raffle.images[0]}?img-width=500&img-onerror=redirect`}
				className="aspect-square w-full rounded-lg object-contain"
			/>
			<div className="absolute right-0 top-0 flex items-center gap-1.5 rounded-bl-md bg-blue-500/20 px-3 py-1.5 text-sm text-blue-500">
				<User className="h-4 w-4" />
				{props.raffle.totalEntries}
			</div>
			<div>
				<div>
					<h2 className="text-white">{props.raffle.name}</h2>
					<p className="text-sm text-grey-200">{props.raffle.community.name}</p>
				</div>
			</div>
		</Link>
	);
}
