import { siteConfig } from "@/config";
import Link from "@/components/Link";
import Button from "@/components/Button";
import NavigateBack from "@/components/NavigateBack";
import TipTap from "@/components/TipTap";
import { getQuest } from "@/server/queries/quests";
import { isUUID } from "@/utils/isUUID";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { questParams } from "@/server/data/params";

export function generateStaticParams() {
	return questParams;
}

async function findQuest(params: { quest: string; community: string }) {
	return isUUID(params.quest)
		? getQuest({ id: params.quest })
		: getQuest({
				handle: params.quest,
				community: params.community,
			});
}

export async function generateMetadata(props: {
	params: Promise<{ quest: string; community: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const quest = await findQuest(params);
	if (!quest) return notFound();
	return {
		title: quest.name,
		metadataBase: new URL(siteConfig.domain),
		openGraph: { type: "website", images: [quest.image] },
		twitter: { site: "@NounsEsports", card: "summary_large_image", images: [quest.image] },
	};
}

export default async function Quest(props: {
	params: Promise<{ quest: string; community: string }>;
}) {
	const params = await props.params;
	const quest = await findQuest(params);
	if (!quest) return notFound();

	return (
		<div className="relative flex w-full justify-center gap-16 px-32 pt-32 max-2xl:px-16 max-xl:px-8 max-xl:pt-28 max-sm:px-4 max-sm:pt-20">
			<div className="flex w-full max-w-3xl flex-col gap-4">
				<NavigateBack
					fallback={quest.event ? `/events/${quest.event.handle}` : "/quests"}
					className="group flex w-fit items-center gap-1 text-red"
				>
					<ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
					Back
				</NavigateBack>
				<article className="overflow-hidden rounded-xl bg-grey-800">
					<img
						src={quest.image}
						alt={quest.name}
						className="h-48 w-full object-cover object-center max-sm:h-32"
					/>
					<div className="flex flex-col gap-8 p-4">
						<div className="flex flex-col gap-2">
							<h1 className="w-full font-luckiest-guy text-3xl text-white">
								{quest.name}
							</h1>
							{quest.description ? <TipTap content={quest.description} /> : null}
						</div>
						<div className="flex items-center justify-between gap-8">
							<h2 className="font-bebas-neue text-2xl text-white">
								Quest is not active
							</h2>
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2 text-white">
									Earns <Sparkles className="h-4 w-4 text-green" />
									{quest.xp}
								</div>
								<Button disabled size="sm">
									Claim
								</Button>
							</div>
						</div>
					</div>
				</article>
				<Link href={`/c/${quest.community.handle}`} className="text-red">
					View {quest.community.name}
				</Link>
			</div>
		</div>
	);
}
