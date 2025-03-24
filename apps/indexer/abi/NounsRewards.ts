export default [
	{
		type: "event",
		name: "ClientRegistered",
		inputs: [
			{
				type: "uint32",
				name: "clientId",
				indexed: true,
			},
			{
				type: "string",
				name: "name",
				indexed: false,
			},
			{
				type: "string",
				name: "description",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "ClientUpdated",
		inputs: [
			{
				type: "uint32",
				name: "clientId",
				indexed: true,
			},
			{
				type: "string",
				name: "name",
				indexed: false,
			},
			{
				type: "string",
				name: "description",
				indexed: false,
			},
		],
		anonymous: false,
	},
] as const;
