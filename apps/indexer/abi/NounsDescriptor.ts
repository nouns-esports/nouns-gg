export default [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "string",
				name: "baseURI",
				type: "string",
			},
		],
		name: "BaseURIUpdated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "bool",
				name: "enabled",
				type: "bool",
			},
		],
		name: "DataURIToggled",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [],
		name: "PartsLocked",
		type: "event",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "accessories",
		outputs: [
			{
				internalType: "bytes",
				name: "",
				type: "bytes",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "accessoryCount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "_accessory",
				type: "bytes",
			},
		],
		name: "addAccessory",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_background",
				type: "string",
			},
		],
		name: "addBackground",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "_body",
				type: "bytes",
			},
		],
		name: "addBody",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint8",
				name: "_paletteIndex",
				type: "uint8",
			},
			{
				internalType: "string",
				name: "_color",
				type: "string",
			},
		],
		name: "addColorToPalette",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "_glasses",
				type: "bytes",
			},
		],
		name: "addGlasses",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes",
				name: "_head",
				type: "bytes",
			},
		],
		name: "addHead",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "_accessories",
				type: "bytes[]",
			},
		],
		name: "addManyAccessories",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string[]",
				name: "_backgrounds",
				type: "string[]",
			},
		],
		name: "addManyBackgrounds",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "_bodies",
				type: "bytes[]",
			},
		],
		name: "addManyBodies",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint8",
				name: "paletteIndex",
				type: "uint8",
			},
			{
				internalType: "string[]",
				name: "newColors",
				type: "string[]",
			},
		],
		name: "addManyColorsToPalette",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "_glasses",
				type: "bytes[]",
			},
		],
		name: "addManyGlasses",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes[]",
				name: "_heads",
				type: "bytes[]",
			},
		],
		name: "addManyHeads",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "arePartsLocked",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "backgroundCount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "backgrounds",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "baseURI",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "bodies",
		outputs: [
			{
				internalType: "bytes",
				name: "",
				type: "bytes",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "bodyCount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256",
			},
			{
				components: [
					{
						internalType: "uint48",
						name: "background",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "body",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "accessory",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "head",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "glasses",
						type: "uint48",
					},
				],
				internalType: "struct INounsSeeder.Seed",
				name: "seed",
				type: "tuple",
			},
		],
		name: "dataURI",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint48",
						name: "background",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "body",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "accessory",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "head",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "glasses",
						type: "uint48",
					},
				],
				internalType: "struct INounsSeeder.Seed",
				name: "seed",
				type: "tuple",
			},
		],
		name: "generateSVGImage",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		type: "function",
		name: "getPartsForSeed",
		stateMutability: "view",
		inputs: [
			{
				name: "seed",
				type: "tuple",
				components: [
					{ name: "background", type: "uint48" },
					{ name: "body", type: "uint48" },
					{ name: "accessory", type: "uint48" },
					{ name: "head", type: "uint48" },
					{ name: "glasses", type: "uint48" },
				],
				internalType: "struct INounsSeeder.Seed",
			},
		],
		outputs: [
			{
				type: "tuple[]",
				components: [
					{ name: "image", type: "bytes" },
					{ name: "palette", type: "bytes" },
				],
				internalType: "struct ISVGRenderer.Part[]",
			},
		],
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "name",
				type: "string",
			},
			{
				internalType: "string",
				name: "description",
				type: "string",
			},
			{
				components: [
					{
						internalType: "uint48",
						name: "background",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "body",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "accessory",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "head",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "glasses",
						type: "uint48",
					},
				],
				internalType: "struct INounsSeeder.Seed",
				name: "seed",
				type: "tuple",
			},
		],
		name: "genericDataURI",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "glasses",
		outputs: [
			{
				internalType: "bytes",
				name: "",
				type: "bytes",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "glassesCount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "headCount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "heads",
		outputs: [
			{
				internalType: "bytes",
				name: "",
				type: "bytes",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "isDataURIEnabled",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "lockParts",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8",
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "palettes",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_baseURI",
				type: "string",
			},
		],
		name: "setBaseURI",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "toggleDataURIEnabled",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256",
			},
			{
				components: [
					{
						internalType: "uint48",
						name: "background",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "body",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "accessory",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "head",
						type: "uint48",
					},
					{
						internalType: "uint48",
						name: "glasses",
						type: "uint48",
					},
				],
				internalType: "struct INounsSeeder.Seed",
				name: "seed",
				type: "tuple",
			},
		],
		name: "tokenURI",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
] as const;
