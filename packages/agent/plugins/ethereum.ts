import { createPlugin } from "../core/createPlugin";

export function ethereumPlugin() {
	return createPlugin(
		async ({ scheduleTask, addTool, addMemory, generateReply }) => {
			return {};
		},
	);
}
