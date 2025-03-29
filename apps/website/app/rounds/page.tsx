import { getRounds } from "@/server/queries/rounds";
import RoundCard from "@/components/RoundCard";
import Link from "@/components/Link";
import { getAuthenticatedUser } from "@/server/queries/users";
import { Plus } from "lucide-react";
import Button from "@/components/Button";

export default async function Rounds() {
	const [rounds, user] = await Promise.all([
		getRounds(),
		getAuthenticatedUser(),
	]);

	const now = new Date();
	const activeRounds = rounds.filter(
		(round) => new Date(round.start) < now && new Date(round.end) > now,
	);

	const upcomingRounds = rounds.filter(
		(round) => new Date(round.start) > now && new Date(round.votingStart) > now,
	);
	const endedRounds = rounds.filter((round) => new Date(round.end) < now);

	return (
		<div className="flex flex-col justify-center gap-16 max-sm:gap-8 w-full pt-32 max-xl:pt-28 max-sm:pt-20">
			<div className="flex max-lg:flex-col max-lg:items-start max-lg:gap-4 items-center justify-between gap-16 mt-8 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between gap-4">
						<h1 className="font-luckiest-guy text-white text-4xl">Rounds</h1>
						{user?.nexus?.admin ? (
							<Button href="/rounds/create" size="sm">
								Create
							</Button>
						) : null}
					</div>
					<p className="max-w-screen-sm max-lg:max-w-none">
						Welcome to Rounds, where the Nouns community plays an active role in
						deciding who and what we fund, making a real impact with every vote.
						Here, anyone can submit a proposal, and everyone has the power to
						vote! By participating and supporting Nouns and our partners, you
						can level up your account, gain additional voting power, and unlock
						unique opportunities.
					</p>
				</div>
				<div className="flex items-center gap-4 w-full max-w-screen-sm max-lg:max-w-none h-40 py-4">
					<div className="flex flex-col w-full h-full rounded-xl bg-grey-800 p-4">
						Rounds Created
						<p className="text-white text-2xl font-semibold w-full h-full items-center flex justify-center">
							{rounds.length}
						</p>
					</div>
					<div className="flex flex-col w-full h-full rounded-xl bg-grey-800 p-4">
						Funds Deployed
						<p className="text-white text-2xl font-semibold w-full h-full items-center flex justify-center">
							$
							{rounds
								.reduce(
									(total, round) =>
										total +
										round.awards.reduce(
											(roundTotal, award) =>
												award.asset === "usdc"
													? roundTotal + Number(award.value) / 1000000
													: roundTotal,
											0,
										),
									0,
								)
								.toLocaleString()}
						</p>
					</div>
					<div className="flex flex-col w-full h-full rounded-xl bg-grey-800 p-4 max-lg:flex max-sm:hidden">
						Total Participants
						<p className="text-white text-2xl font-semibold w-full h-full items-center flex justify-center">
							{
								new Set(
									rounds
										.flatMap((round) => [...round.proposals, ...round.votes])
										.map((item) => item.user),
								).size
							}
						</p>
					</div>
				</div>
			</div>
			{activeRounds.length > 0 ? (
				<div className="flex flex-col gap-4">
					<h2 className="text-white font-luckiest-guy text-3xl pl-32 max-2xl:pl-16 max-xl:pl-8 max-sm:pl-4">
						Happening Now
					</h2>
					<div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:flex max-lg:overflow-x-scroll max-lg:scrollbar-hidden gap-4 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
						{activeRounds.map((round) => (
							<RoundCard
								key={round.id}
								id={round.id}
								image={round.image}
								name={round.name}
								start={round.start}
								votingStart={round.votingStart}
								end={round.end}
								community={
									round.community
										? {
												id: round.community.id,
												name: round.community.name,
												image: round.community.image,
											}
										: undefined
								}
								className="max-lg:w-80 max-lg:flex-shrink-0"
							/>
						))}
					</div>
				</div>
			) : (
				""
			)}
			{upcomingRounds.length > 0 ? (
				<div className="flex flex-col gap-4">
					<h2 className="text-white font-luckiest-guy text-3xl pl-32 max-2xl:pl-16 max-xl:pl-8 max-sm:pl-4">
						Starting Soon
					</h2>
					<div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:flex max-lg:overflow-x-scroll max-lg:scrollbar-hidden gap-4 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
						{upcomingRounds.map((round) => (
							<RoundCard
								key={round.id}
								id={round.id}
								image={round.image}
								name={round.name}
								start={round.start}
								votingStart={round.votingStart}
								end={round.end}
								community={
									round.community
										? {
												id: round.community.id,
												name: round.community.name,
												image: round.community.image,
											}
										: undefined
								}
								className="max-lg:w-80 max-lg:flex-shrink-0"
							/>
						))}
					</div>
				</div>
			) : (
				""
			)}
			<div className="flex flex-col gap-4">
				<h2 className="text-white font-luckiest-guy text-3xl pl-32 max-2xl:pl-16 max-xl:pl-8 max-sm:pl-4">
					Completed
				</h2>
				<div className="grid grid-cols-4 max-2xl:grid-cols-3 max-lg:flex max-lg:overflow-x-scroll max-lg:scrollbar-hidden gap-4 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
					{endedRounds.map((round) => (
						<RoundCard
							key={round.id}
							id={round.id}
							image={round.image}
							name={round.name}
							start={round.start}
							votingStart={round.votingStart}
							end={round.end}
							community={
								round.community
									? {
											id: round.community.id,
											name: round.community.name,
											image: round.community.image,
										}
									: undefined
							}
							className="max-lg:w-80 max-lg:flex-shrink-0"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
