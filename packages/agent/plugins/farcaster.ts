import { createPlugin } from "../core/createPlugin";

export function farcasterPlugin(config: {
	fid: number;
	alwaysRespondToReplys?: boolean;
}) {
	return createPlugin(
		async ({ server, scheduleTask, addTool, addMemory, generateReply }) => {
			server.post("/farcaster", async (c) => {
				const cast: {
					data: {
						hash: string;
						author: {
							fid: number;
						};
						text: string;
						parent_url: string;
						root_parent_url: string;
						mentioned_profiles: Array<{ fid: number }>;
						channel: {
							id: string;
						};
					};
				} = await c.req.json();

				if (cast.data.author.fid === config.fid) {
					return;
				}

				const isReply = cast.data.parent_url !== cast.data.root_parent_url;

				const mentioned = cast.data.mentioned_profiles.some(
					(profile) => profile.fid === config.fid,
				);

				if (!config.alwaysRespondToReplys && isReply && !mentioned) {
					return;
				}

				const reply = await generateReply(cast.data.text, {
					id: cast.data.hash,
					author: cast.data.author.fid.toString(),
					room: cast.data.channel.id,
					mentions: cast.data.mentioned_profiles.map((profile) =>
						profile.fid.toString(),
					),
					embeds: [],
				});

				// check for existing reply
				console.log("Cast received", reply, cast);
			});
		},
	);
}
