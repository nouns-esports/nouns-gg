import EventCard from "@/components/EventCard";
import { getEvents } from "@/server/queries/events";
import { getAuthenticatedUser } from "@/server/queries/users";
import Button from "@/components/Button";

export default async function Events() {
	const [events, user] = await Promise.all([
		getEvents(),
		getAuthenticatedUser(),
	]);

	const happeningNow = events.filter(
		(event) =>
			new Date(event.start) < new Date() && new Date(event.end) > new Date(),
	);
	const upcoming = events.filter((event) => new Date(event.start) > new Date());
	const ended = events.filter((event) => new Date(event.end) < new Date());

	return (
		<div className="flex flex-col gap-8 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
			<div className="flex items-center justify-between w-full">
				<h1 className="font-luckiest-guy text-white text-4xl">Events</h1>
				{user?.nexus?.admin ? (
					<Button href="/events/create">Create</Button>
				) : null}
			</div>
			{happeningNow.length > 0 && (
				<div className="flex flex-col gap-4">
					<h2 className="text-white font-luckiest-guy text-3xl">
						Happening Now
					</h2>
					<div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
						{happeningNow.map((event) => (
							<EventCard
								key={event.id}
								handle={event.handle}
								name={event.name}
								image={event.image}
								start={event.start}
								end={event.end}
							/>
						))}
					</div>
				</div>
			)}
			{upcoming.length > 0 && (
				<div className="flex flex-col gap-4">
					<h2 className="text-white font-luckiest-guy text-3xl">Upcoming</h2>
					<div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
						{upcoming.map((event) => (
							<EventCard
								key={event.id}
								handle={event.handle}
								name={event.name}
								image={event.image}
								start={event.start}
								end={event.end}
							/>
						))}
					</div>
				</div>
			)}
			{ended.length > 0 && (
				<div className="flex flex-col gap-4">
					<h2 className="text-white font-luckiest-guy text-3xl">Ended</h2>
					<div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
						{ended.map((event) => (
							<EventCard
								key={event.id}
								handle={event.handle}
								name={event.name}
								image={event.image}
								start={event.start}
								end={event.end}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
