import { db } from "../";
import { questActions, quests } from "../schema/public";

const image = "https://ipfs.nouns.gg/ipfs/bafybeiheghyjnanqhdqwbn7mau6zwg7ub3up5cljxo5rdlffw6h7m6mwi4";
const description = null;
const createdAt = new Date();
const event = 13;
const community = 21;

const generatedData: Array<{
    xp: 25 | 50;
    handle: string; // unique quest handle (for a url)
    name: string; // quest name (Follow {player name} on {platform 1?} {platform 2?} {platform 3?})
    actionInputs: Array<{
        url: string; // url of the link
        label: string; // ({player name} {Site name}) ex: Joe's Twitch
        action: string; // What the user will do at the url (Follow, Visit, Share, etc)
    }>;
}> = [
        // Follow NADCL on X
        {
            xp: 25,
            handle: "follow-nadcl-x",
            name: "Follow NADCL on X",
            actionInputs: [
                {
                    url: "https://x.com/NADotaEsports",
                    label: "NADCL X",
                    action: "Follow",
                },
            ],
        },
        // Follow NADCL on Twitch
        {
            xp: 25,
            handle: "follow-nadcl-twitch",
            name: "Follow NADCL on Twitch",
            actionInputs: [
                {
                    url: "https://www.twitch.tv/nadcleague",
                    label: "NADCL Twitch",
                    action: "Follow",
                },
            ],
        },
        // Share the Hype (NADCL S8 announcement post)
        {
            xp: 25,
            handle: "share-nadcl-hype",
            name: "Share the Hype",
            actionInputs: [
                {
                    url: "https://x.com/ChompixGaming/status/1919511447085711601",
                    label: "NADCL S8 Announcement Post",
                    action: "Share",
                },
            ],
        },
    ];

await db.primary.transaction(async (tx) => {
    for (const data of generatedData) {
        const [quest] = await tx.insert(quests).values({
            createdAt,
            description,
            image,
            handle: data.handle,
            name: data.name,
            xp: data.xp,
            active: true,
            event,
            community,
        }).returning();

        for (const action of data.actionInputs) {
            const inputs = {
                link: {
                    url: action.url,
                    label: action.label,
                    action: action.action,
                },
            }

            await tx.insert(questActions).values({
                quest: quest.id,
                action: "visitLink",
                description: await generateDescription(inputs),
                inputs,
            });
        }
    }
});

async function generateDescription(inputs: {
    link: {
        action: string;
        url: string;
        label: string;
    };
}) {
    const parts = [];

    if (inputs.link.action) {
        parts.push({
            text: inputs.link.action,
        });
    } else parts.push({ text: "Visit" });

    let url: URL;

    try {
        url = new URL(inputs.link.url);
    } catch (error) {
        throw new Error(`Invalid URL: ${inputs.link.url}`);
    }

    parts.push({
        text: inputs.link.label,
        href: `/visit?url=${url.toString()}`,
    });

    return parts;
}