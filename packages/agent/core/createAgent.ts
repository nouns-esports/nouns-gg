import {
	type CoreTool,
	generateObject,
	generateText,
	type LanguageModelV1,
	ToolExecutionError,
	tool as vercelTool,
} from "ai";
import figlet from "figlet";
import colors from "kleur";
import type { createPlugin } from "./createPlugin";
import { createServer } from "./createServer";
import { z } from "zod";
import { TZDate } from "@date-fns/tz";

export type Config<TPlugins> = {
	model: LanguageModelV1;
	character: {
		name: string;
		bio: string;
		lore?: string[];
	};
	plugins?: TPlugins;
	onMessage?: (message: {
		provider: keyof TPlugins;
		context?: MessageContext<Extract<keyof TPlugins, string>>;
	}) => Promise<string | void>;
	memory?: any;
	server?: {
		port: number;
	};
};

export type MessageContext<TProvider extends string> = {
	id: string;
	provider: TProvider;
	// This will likely need to be more robust. Differnt plugins might need access to different identifiers of an author (for example, backend id, username, display name, handle, etc...)
	author: string;
	room: string;
	mentions?: string[];
	embeds?: string[];
};

export type Tool<TProvider extends string, TParameters> = {
	description: string;
	providers?: TProvider[];
	parameters?: TParameters;
	execute: (props: {
		parameters: z.infer<
			TParameters extends z.ZodType ? TParameters : z.ZodSchema
		>;
		context: MessageContext<TProvider>;
	}) => Promise<any>;
};

export async function createAgent<
	TPlugins extends Record<string, ReturnType<typeof createPlugin>>,
>(config: Config<TPlugins>) {
	console.log(
		figlet.textSync(config.character.name, {
			font: "ANSI Shadow",
			horizontalLayout: "default",
			verticalLayout: "default",
			width: 80,
			whitespaceBreak: true,
		}),
	);
	console.log(colors.blue(config.character.bio));

	const tools: Tool<Extract<keyof TPlugins, string>, z.ZodSchema>[] = [];

	const { server, start } = await createServer(config);

	async function scheduleTask() {}

	function addTool<TParameters extends z.ZodSchema>(
		params: Tool<Extract<keyof TPlugins, string>, TParameters>,
	) {
		tools.push(params);
	}

	async function addMemory() {}

	async function generateReply(
		prompt: string,
		context: MessageContext<Extract<keyof TPlugins, string>>,
	) {
		const developerContext = await config.onMessage?.(context);

		const activeTools = await generateObject({
			model: config.model,
			prompt,
			system:
				"Determine which tools (if any) are relevant to this prompt\n" +
				"Don't choose any tools unless the prompt conveys an intent for you to do some task as in 'can you do this?' or 'Do this thing'\n" +
				"Be very thoughtful in this selection because even if the prompt mentions tools, they might not actually want you to execute one (ex: 'What tools do you have?'\n" +
				"Only select relevant tools if you are exteremly confident they are to be used and its perfectly ok if you don't select any\n" +
				`Tools: \n${tools.map((tool, index) => `${index}: ${tool.description}`).join("\n")}`,
			schema: z.object({
				tools: z
					.array(z.number())
					.describe("The indexes of the relevant tools if any"),
			}),
		});

		console.log("Active Tools: ", activeTools.object.tools);

		const date = new TZDate(new Date(), "America/New_York");

		const reply = await generateText({
			model: config.model,
			prompt,
			system:
				"You are an agent with the following characteristics.\n" +
				`Name: ${config.character.name}\n` +
				`Bio: ${config.character.bio}\n` +
				`Lore: ${config.character.lore?.join(" ")}\n` +
				"Additional context relevant to this prompt.\n" +
				`Provider: ${context.provider}\n` +
				`Author: ${context.author}\n` +
				`Room: ${context.room}\n` +
				`Current Time: ${date.toLocaleDateString("en-US", { weekday: "short" })} ${date.toISOString()}\n` +
				(developerContext ?? ""),
			tools: tools
				.filter((_, index) => activeTools.object.tools.includes(index))

				.reduce(
					(obj, tool, index) => {
						obj[index] = vercelTool({
							description: tool.description,
							parameters: tool.parameters ?? z.object({}),
							execute: async (parameters) => {
								console.log("Executing tool: ", tool.description);
								await tool.execute({ parameters, context });
							},
						});

						return obj;
					},
					{} as Record<string, CoreTool<any, any>>,
				),
			maxSteps: 10,
		});

		return reply;
	}

	const plugins = {} as {
		[K in keyof TPlugins]: Awaited<ReturnType<TPlugins[K]>>;
	};

	if (config.plugins) {
		for (const [id, register] of Object.entries(config.plugins)) {
			console.log("Registering plugin: ", id);
			const result = await register({
				config,
				server,
				scheduleTask,
				addTool: (params) =>
					addTool({
						...params,
						providers: [id as Extract<keyof TPlugins, string>],
					}),
				addMemory,
				generateReply: (prompt, context) =>
					generateReply(prompt, {
						...context,
						provider: id as Extract<keyof TPlugins, string>,
					}),
			});

			plugins[id as keyof TPlugins] = result as Awaited<
				ReturnType<TPlugins[keyof TPlugins]>
			>;
		}
	}

	// await start();
	// console.log(
	// 	`Server running at http://localhost:${config.server?.port ?? 8787}`,
	// );

	return {
		server,
		plugins,
		scheduleTask,
		addTool,
		addMemory,
	};
}
