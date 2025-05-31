import { getCommunities } from "@/server/queries/communities";
import { getAuthenticatedUser } from "@/server/queries/users";
import Link from "@/components/Link";

export default async function Communities() {
	const [communities, user] = await Promise.all([
		getCommunities(),
		getAuthenticatedUser(),
	]);

	// Index communities by the first letter of their name
	const communitiesByLetter: Record<string, typeof communities> = {};

	for (let i = 65; i <= 90; i++) {
		const letter = String.fromCharCode(i);
		communitiesByLetter[letter] = [];
	}

	for (const community of communities) {
		const firstLetter = community.name.charAt(0).toUpperCase();
		if (communitiesByLetter[firstLetter]) {
			communitiesByLetter[firstLetter].push(community);
		}
	}

	return (
		<div className="flex flex-col w-full items-center">
			<div className="flex flex-col gap-8 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 max-w-[1920px] w-full">
				{Object.entries(communitiesByLetter).map(([letter, communities]) => {
					if (communities.length === 0) return null;

					return (
						<div key={letter} className="flex flex-col gap-4">
							<h2 className="text-white font-luckiest-guy text-3xl">
								{letter}
							</h2>
							<div className="flex gap-4 flex-wrap">
								{communities.map((community) => (
									<Link
										href={`/c/${community.handle}`}
										key={community.id}
										className="flex gap-4 bg-grey-800 rounded-xl p-4 hover:bg-grey-600 transition-colors"
									>
										<img
											src={community.image}
											alt={community.name}
											className="w-8 h-8 object-cover rounded-lg"
										/>
										<h2 className="text-white font-bebas-neue text-2xl text-nowrap">
											{community.name}
										</h2>
									</Link>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
