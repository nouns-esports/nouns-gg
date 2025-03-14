import Link from "@/components/Link";
import { getRosters } from "@/server/queries/rosters";
import { ArrowRight } from "lucide-react";

export default async function Rosters() {
	const rosters = await getRosters();

	return (
		<div className="flex flex-col w-full items-center">
			<div className="flex flex-col gap-4 pt-32 max-xl:pt-28 max-sm:pt-24 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 w-full max-w-[1920px]">
				<h1 className="text-4xl text-white font-luckiest-guy">Rosters</h1>
				<div className="grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
					{rosters.map((roster) => (
						<div
							key={roster.id}
							className="flex justify-between gap-8 bg-grey-800 rounded-xl p-4 pl-5"
						>
							<div className="flex flex-col justify-between">
								<h2 className="text-3xl text-white font-bebas-neue whitespace-nowrap">
									{roster.name}
								</h2>
								<Link
									href={`/rosters/${roster.community.id}`}
									className="text-lg text-red group flex items-center gap-1"
								>
									View
									<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</Link>
							</div>
							<img
								alt={roster.community.name}
								src={roster.community.image}
								className="h-16 aspect-square rounded-lg"
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
