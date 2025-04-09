import { db } from "../";
import { links, quests } from "../schema/public";

const image = "";
const description = "";
const createdAt = new Date();
const event = 7;
const community = 1;

const generatedData: Array<{
	xp: 25 | 50;
	handle: string; // unique quest handle (for a url)
	name: string; // quest name (Follow {player name} on {platform 1?} {platform 2?} {platform 3?})
	actionInputs: Array<{
		link: string; // unique link handle
		url: string; // url of the link
		name: string; // ({player name} {Site name}) ex: Joe's Twitch
		type: "website";
	}>;
}> = [];

await db.primary.transaction(async (tx) => {
	for (const data of generatedData) {
		for (const action of data.actionInputs) {
			await tx
				.insert(links)
				.values({
					id: `pichanga-femenina-${action.link}`,
					url: action.url,
				})
				.onConflictDoNothing();
		}

		await tx.insert(quests).values({
			createdAt,
			description,
			image,
			actions: Array(data.actionInputs.length).fill("visitLink"),
			handle: data.handle,
			name: data.name,
			xp: data.xp,
			active: true,
			actionInputs: data.actionInputs.map((input) => ({
				link: `pichanga-femenina-${input.link}`,
				name: input.name,
				type: input.type,
			})),
			event,
			community,
		});
	}
});
