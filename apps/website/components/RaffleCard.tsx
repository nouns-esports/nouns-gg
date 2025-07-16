import type { getRaffles } from "@/server/queries/raffles";
import { ToggleModal } from "./Modal";
import Button from "./Button";
import { Clock, User } from "lucide-react";
import Countdown from "./Countdown";
import { twMerge } from "tailwind-merge";

export default function RaffleCard(props: {
	raffle: NonNullable<Awaited<ReturnType<typeof getRaffles>>>[number];
}) {
	const userEntries = props.raffle.entries.reduce(
		(acc, curr) => acc + curr.amount,
		0,
	);

	return (
		<ToggleModal
			id={`raffle:${props.raffle.id}`}
			className="relative flex flex-col gap-4 rounded-xl bg-grey-800 hover:bg-grey-600 transition-colors p-4 overflow-hidden"
		>
			<img
				alt={props.raffle.name}
				src={`${props.raffle.images[0]}?img-width=500&img-onerror=redirect`}
				className="aspect-square w-full object-contain rounded-lg"
			/>
			<div className="absolute top-0 left-0 flex items-center gap-1.5 text-white text-sm bg-grey-500 rounded-br-md py-1.5 px-3">
				<Clock className="w-4 h-4" />
				<Countdown date={props.raffle.end} />
			</div>
			<div className="absolute top-0 right-0 flex items-center gap-1.5 text-blue-500 text-sm bg-blue-500/20 rounded-bl-md py-1.5 px-3">
				<User className="w-4 h-4 " />
				{props.raffle.totalEntries}
			</div>
			<div className="flex flex-col gap-2">
				<h2 className="text-white">{props.raffle.name}</h2>
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<img
							src={
								props.raffle.community.handle === "nounsgg"
									? "https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
									: props.raffle.community.image
							}
							alt={`${props.raffle.community.name} ${props.raffle.community.points?.name ?? "Points"}`}
							className="w-6 h-6 rounded-full"
						/>
						<p
							className={twMerge(
								"text-lg font-semibold",
								props.raffle.community.points?.name === "Gold"
									? "text-[#FEBD1C]"
									: "text-white",
							)}
						>
							{props.raffle.gold}
						</p>
					</div>
					<ToggleModal id={`raffle:${props.raffle.id}`}>
						<Button disabled={userEntries >= (props.raffle.limit ?? Infinity)}>
							{userEntries >= (props.raffle.limit ?? Infinity)
								? "Max Entries"
								: "Enter"}
						</Button>
					</ToggleModal>
				</div>
			</div>
		</ToggleModal>
	);
}
