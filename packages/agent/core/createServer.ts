import type { Config } from "./createAgent";
import { Hono } from "hono";
import { get } from "js-runtime";

export async function createServer(config: Config<any>) {
	const runtime = get();

	const server = new Hono();
	server.get("/", (c) => c.text("Honooo!"));

	return {
		server,
		start: async () => {
			if (runtime === "node") {
				const { serve } = await import("@hono/node-server");

				const nodeServer = serve({
					fetch: server.fetch,
					port: config.server?.port ?? 8787,
				});

				return await new Promise((resolve) => {
					nodeServer.on("listening", () => resolve(nodeServer));
				});
			}

			if (runtime === "bun") {
				return Bun.serve({
					fetch: server.fetch,
					port: config.server?.port ?? 8787,
				});
			}

			throw new Error("Unsupported runtime");
		},
	};
}
