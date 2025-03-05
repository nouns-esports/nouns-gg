import Button from "@/components/Button";
import { ToggleModal } from "@/components/Modal";
import { getEvent } from "@/server/queries/events";
import { getStations } from "@/server/queries/stations";
import { getAuthenticatedUser } from "@/server/queries/users";
import { and, inArray } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { Check, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

export default async function Stations(props: {
	params: Promise<{ event: string }>;
	searchParams: Promise<{ claimed?: string }>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;

	console.log("searchParams", searchParams);

	const [user, stations, event] = await Promise.all([
		getAuthenticatedUser(),
		getStations({ event: params.event }),
		getEvent({ id: params.event }),
	]);

	if (!event) {
		redirect("/events");
	}

	if (!user) {
		return (
			<div className="flex flex-col gap-4 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
				<h1 className="text-white text-2xl font-luckiest-guy">
					You must sign in to continue
				</h1>
				<ToggleModal id="sign-in">
					<Button>Sign in</Button>
				</ToggleModal>
			</div>
		);
	}

	const claimedStations = await db.query.xp.findMany({
		where: and(
			eq(xp.user, user.id),
			inArray(
				xp.station,
				stations.map((station) => station.id),
			),
		),
	});

	const justClaimed = claimedStations.find(
		(claimed) => claimed.id === Number(searchParams.claimed),
	);

	return (
		<>
			<div className="flex flex-col gap-8 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl text-white font-luckiest-guy">
						{event.name}
					</h1>
				</div>
				<div className="flex flex-col gap-4">
					{stations.map((station, index) => {
						const claimed = claimedStations.find(
							(claimed) => claimed.station === station.id,
						);

						return (
							<div
								key={station.id}
								className={twMerge(
									"flex bg-grey-800 rounded-xl p-3 gap-2 justify-between items-center",
									claimed && "opacity-60 pointer-events-none",
								)}
							>
								<div className="flex items-center gap-3">
									{claimed ? (
										<div className="rounded-full bg-green w-7 h-7 flex items-center justify-center">
											<Check className="w-5 h-5 text-black/50" />
										</div>
									) : (
										<div className="rounded-full bg-black/60 h-7 w-7 flex items-center justify-center text-sm">
											{index + 1}
										</div>
									)}
									<h2 className="text-white font-bebas-neue text-2xl">
										{station.name}
									</h2>
								</div>
								<p className="text-white flex items-center gap-2 mr-1 pointer-events-none">
									<Sparkles className="w-4 h-4 text-green" />
									{station.xp}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
