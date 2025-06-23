import Link from "@/components/Link";
import Button from "./Button";
import { CalendarDays } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { getEvents } from "@/server/queries/events";

export default function EventCard(props: {
	event: NonNullable<Awaited<ReturnType<typeof getEvents>>>[number];
	className?: string;
}) {
	return (
		<div
			className={twMerge(
				"w-full h-min group relative flex flex-col gap-2 aspect-video rounded-xl overflow-hidden",
				props.className,
			)}
		>
			<Link
				href={`/c/${props.event.community.handle}/events/${props.event.handle}`}
				className="absolute z-10 top-0 left-0 w-full h-full"
			/>
			<img
				src={props.event.image}
				alt={props.event.name}
				className="w-full rotate-[0.01deg] h-full object-cover brightness-75 select-none group-hover:scale-105 transition-transform"
			/>
			<div className="absolute z-10 top-0 left-0 p-4 flex flex-col justify-between h-full pointer-events-none w-full">
				<p className="font-bebas-neue text-3xl text-white">
					{props.event.name}
				</p>
				<div className="pointer-events-auto w-full flex justify-between items-center">
					<Button
						href={`/c/${props.event.community.handle}/events/${props.event.handle}`}
					>
						View Event
					</Button>
					<div className="text-sm text-white bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1.5 w-min text-nowrap flex items-center gap-2 cursor-pointer">
						<CalendarDays className="w-4 h-4" />
						{new Date() < new Date(props.event.start) ? (
							`Starts on ${new Date(props.event.start).toLocaleDateString()}`
						) : new Date() > new Date(props.event.end) ? (
							`Ended on ${new Date(props.event.end).toLocaleDateString()}`
						) : (
							<div className="flex items-center gap-2 text-nowrap">
								<div className="w-2 h-2 bg-red rounded-full animate-pulse" />
								Happening now
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
