// import type { createAgent, Tool } from "./createAgent";
// import { z } from "zod";

// export function createTool<
// 	TAgent extends Awaited<ReturnType<typeof createAgent>>,
// >(tool: Tool<Extract<keyof TAgent["plugins"], string>, z.ZodSchema>) {
// 	return tool;
// }

// Tools need to be wrapped in some kind of createTool function so they can be imported from other files

// ACTUALLY MAYBE, TOP LEVEL TOOLS SHOULD JUST BE LIKE PLUGINS
