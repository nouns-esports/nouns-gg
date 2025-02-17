import { env } from "~/env";
import { createPlugin } from "../core/createPlugin";
import { Scraper } from "agent-twitter-client";

export function twitterPlugin(options: {
	username: string;
	password: string;
	cookies?: string;
}) {
	return createPlugin(
		async ({ config, scheduleTask, addTool, addMemory, generateReply }) => {
			const scraper = new Scraper();

			if (options.cookies) {
				await scraper.setCookies(JSON.parse(options.cookies));
			} else if (config.memory) {
				// TODO: Set cookies from memory
				await scraper.setCookies(JSON.parse(config.memory.cookies));
			}

			const cookies = await scraper.getCookies();

			if (cookies.length < 1) {
				await scraper.login(options.username, options.password);

				if (!config.memory) {
					console.warn(
						"Memory module not found. Save these cookies to your evnironment variables to prevent repeated logins, which can lead to your Twitter account being suspended.",
					);
				}
			}

			return {
				scraper,
			};
		},
	);
}
