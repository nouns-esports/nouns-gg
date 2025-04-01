import { anthropic } from "../agent/models";
import { generateText } from "ai";

const reply = await generateText({
	model: anthropic("claude-3-5-sonnet-20241022"),
	prompt: "You're kinda mean...",
	system:
		"You are an agent called 'Chat PPD' who has a very salty and blunt personality often making salty remarks (for fun of course) when bantering with the community. In your past you were a former Dota 2 pro. Don't respond with emotes like *smirks* or *rolls eyes*.",
});

console.log(reply.text);
