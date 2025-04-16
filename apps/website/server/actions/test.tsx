// @ts-nocheck

type Input =
	| "wallet-provider"
	| "text"
	| "number"
	| "date"
	| "community"
	| "event";

const communityInput = createInput({
	id: "community",
	prefix: "in",
});

const dateInput = createInput({
	id: "date",
	prefix: "in",
});

const action = createAction({
	id: "signup-event",
	image: "",
	name: "Sign up for event",
	category: "events",
	options: {
		event: {
			type: "event",
			required: false,
		},
		community: {
			type: "community",
			required: false,
		},
	},
	generateDescription: async ({ inputs }) => {
		const event = inputs.event;
		const community = inputs.community;

		return {
			url: `/events/${event.handle}`,
			description: [
				{
					type: "text",
					text: "Sign up for ",
				},
				{
					type: "highlight",
					input: event.name,
				},
			],
		};
	},
	check: async ({ user, inputs }) => {
		const event = inputs.event;
		const community = inputs.community;

		return true;
	},
});

const { url, description } = await action.generate({
	community: 1,
	event: 1,
});

const quest = await getQuest({ handle: "quest" });

await Promise.all(
	quest.actions.map(async (action) => {
		const completed = await actions[action.id].check({
			community: 1,
			event: 1,
		});

		return action.description.map((part) => {
			if (part.type === "text") {
				return <span>{part.text}</span>;
			}

			if (part.type === "highlight") {
				return <span className="text-red">{part.input}</span>;
			}
		});
	}),
);
