import { getUser, getUserStats } from "@/server/queries/users";
import { BarChart, ExternalLink, Wallet } from "lucide-react";
import { notFound } from "next/navigation";
import { profileParams } from "@/server/data/params";

export function generateStaticParams() {
	return profileParams;
}

export default async function User(props: {
	params: Promise<{ user: string }>;
}) {
	const params = await props.params;
	const user = await getUser({ id: params.user });
	if (!user) return notFound();
	const stats = await getUserStats({ user: user.id });

	return (
		<div className="flex flex-col items-center px-32 pt-32 max-2xl:px-16 max-xl:px-8 max-xl:pt-28 max-sm:px-4 max-sm:pt-20">
			<div className="flex w-full max-w-2xl flex-col gap-4">
				<section className="flex flex-col gap-6 rounded-xl bg-grey-800 p-6">
					<div>
						<div className="flex items-center gap-4">
							<img
								alt={user.name}
								src={user.image}
								className="h-16 w-16 flex-shrink-0 rounded-full bg-white object-cover"
							/>
							<div>
								<h1 className="font-luckiest-guy text-2xl text-white">
									{user.name}
								</h1>
								{user.bio ? <p className="mt-1 text-grey-200">{user.bio}</p> : null}
								{user.twitterProfile?.username ? (
									<a
										href={`https://x.com/${user.twitterProfile.username}`}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-2 inline-flex items-center gap-1 text-red"
									>
										@{user.twitterProfile.username}
										<ExternalLink className="h-3.5 w-3.5" />
									</a>
								) : null}
							</div>
						</div>
					</div>
					<div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
						<Stat label="Proposals" value={stats.proposalsCreated} />
						<Stat label="Votes" value={stats.votesCast} />
						<Stat label="Quests" value={stats.questsCompleted} />
					</div>
					{user.wallets?.length ? (
						<div>
							<h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
								<Wallet className="h-4 w-4 text-red" />
								Wallets
							</h2>
							<ul className="flex flex-col gap-2">
								{user.wallets.map((wallet: any) => (
									<li
										key={`${wallet.chain}:${wallet.address}`}
										className="overflow-hidden rounded-lg bg-grey-600 px-3 py-2"
									>
										<p className="text-xs uppercase text-grey-200">{wallet.chain}</p>
										<code className="block truncate text-sm text-white">
											{wallet.address}
										</code>
									</li>
								))}
							</ul>
						</div>
					) : null}
				</section>
			</div>
		</div>
	);
}

function Stat(props: { label: string; value: number }) {
	return (
		<div className="rounded-lg bg-grey-600 p-3">
			<p className="flex items-center gap-1 text-sm text-grey-200">
				<BarChart className="h-3.5 w-3.5" />
				{props.label}
			</p>
			<p className="mt-1 text-2xl font-bold text-white">{props.value}</p>
		</div>
	);
}
