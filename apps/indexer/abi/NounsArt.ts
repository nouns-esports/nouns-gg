export default [
	{
		type: "error",
		name: "SenderIsNotDescriptor",
		inputs: [],
	},
	{
		type: "error",
		name: "EmptyPalette",
		inputs: [],
	},
	{
		type: "error",
		name: "BadPaletteLength",
		inputs: [],
	},
	{
		type: "error",
		name: "EmptyBytes",
		inputs: [],
	},
	{
		type: "error",
		name: "BadDecompressedLength",
		inputs: [],
	},
	{
		type: "error",
		name: "BadImageCount",
		inputs: [],
	},
	{
		type: "error",
		name: "ImageNotFound",
		inputs: [],
	},
	{
		type: "error",
		name: "PaletteNotFound",
		inputs: [],
	},
	{
		type: "event",
		name: "DescriptorUpdated",
		inputs: [
			{
				name: "oldDescriptor",
				type: "address",
				indexed: false,
			},
			{
				name: "newDescriptor",
				type: "address",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "InflatorUpdated",
		inputs: [
			{
				name: "oldInflator",
				type: "address",
				indexed: false,
			},
			{
				name: "newInflator",
				type: "address",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "BackgroundsAdded",
		inputs: [
			{
				name: "count",
				type: "uint256",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "PaletteSet",
		inputs: [
			{
				name: "paletteIndex",
				type: "uint8",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "BodiesAdded",
		inputs: [
			{
				name: "count",
				type: "uint16",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "AccessoriesAdded",
		inputs: [
			{
				name: "count",
				type: "uint16",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "HeadsAdded",
		inputs: [
			{
				name: "count",
				type: "uint16",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "GlassesAdded",
		inputs: [
			{
				name: "count",
				type: "uint16",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "BodiesUpdated",
		inputs: [
			{
				name: "count",
				type: "uint16",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "AccessoriesUpdated",
		inputs: [
			{
				name: "count",
				type: "uint16",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "HeadsUpdated",
		inputs: [
			{
				name: "count",
				type: "uint16",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "GlassesUpdated",
		inputs: [
			{
				name: "count",
				type: "uint16",
				indexed: false,
			},
		],
		anonymous: false,
	},
	{
		type: "function",
		name: "descriptor",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "inflator",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "setDescriptor",
		inputs: [
			{
				name: "descriptor",
				type: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "setInflator",
		inputs: [
			{
				name: "inflator",
				type: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "addManyBackgrounds",
		inputs: [
			{
				name: "_backgrounds",
				type: "string[]",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "addBackground",
		inputs: [
			{
				name: "_background",
				type: "string",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "palettes",
		inputs: [
			{
				name: "paletteIndex",
				type: "uint8",
			},
		],
		outputs: [
			{
				name: "",
				type: "bytes",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "setPalette",
		inputs: [
			{
				name: "paletteIndex",
				type: "uint8",
			},
			{
				name: "palette",
				type: "bytes",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "addBodies",
		inputs: [
			{
				name: "encodedCompressed",
				type: "bytes",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "addAccessories",
		inputs: [
			{
				name: "encodedCompressed",
				type: "bytes",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "addHeads",
		inputs: [
			{
				name: "encodedCompressed",
				type: "bytes",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "addGlasses",
		inputs: [
			{
				name: "encodedCompressed",
				type: "bytes",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "addBodiesFromPointer",
		inputs: [
			{
				name: "pointer",
				type: "address",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "setPalettePointer",
		inputs: [
			{
				name: "paletteIndex",
				type: "uint8",
			},
			{
				name: "pointer",
				type: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "addAccessoriesFromPointer",
		inputs: [
			{
				name: "pointer",
				type: "address",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "addHeadsFromPointer",
		inputs: [
			{
				name: "pointer",
				type: "address",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "addGlassesFromPointer",
		inputs: [
			{
				name: "pointer",
				type: "address",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "backgroundCount",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "bodyCount",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "accessoryCount",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "headCount",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "glassesCount",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "backgrounds",
		inputs: [
			{
				name: "index",
				type: "uint256",
			},
		],
		outputs: [
			{
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "heads",
		inputs: [
			{
				name: "index",
				type: "uint256",
			},
		],
		outputs: [
			{
				name: "",
				type: "bytes",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "bodies",
		inputs: [
			{
				name: "index",
				type: "uint256",
			},
		],
		outputs: [
			{
				name: "",
				type: "bytes",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "accessories",
		inputs: [
			{
				name: "index",
				type: "uint256",
			},
		],
		outputs: [
			{
				name: "",
				type: "bytes",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "glasses",
		inputs: [
			{
				name: "index",
				type: "uint256",
			},
		],
		outputs: [
			{
				name: "",
				type: "bytes",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getBodiesTrait",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "tuple",
				components: [
					{
						name: "storagePages",
						type: "tuple[]",
						components: [
							{
								name: "imageCount",
								type: "uint16",
							},
							{
								name: "decompressedLength",
								type: "uint80",
							},
							{
								name: "pointer",
								type: "address",
							},
						],
					},
					{
						name: "storedImagesCount",
						type: "uint256",
					},
				],
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getAccessoriesTrait",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "tuple",
				components: [
					{
						name: "storagePages",
						type: "tuple[]",
						components: [
							{
								name: "imageCount",
								type: "uint16",
							},
							{
								name: "decompressedLength",
								type: "uint80",
							},
							{
								name: "pointer",
								type: "address",
							},
						],
					},
					{
						name: "storedImagesCount",
						type: "uint256",
					},
				],
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getHeadsTrait",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "tuple",
				components: [
					{
						name: "storagePages",
						type: "tuple[]",
						components: [
							{
								name: "imageCount",
								type: "uint16",
							},
							{
								name: "decompressedLength",
								type: "uint80",
							},
							{
								name: "pointer",
								type: "address",
							},
						],
					},
					{
						name: "storedImagesCount",
						type: "uint256",
					},
				],
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getGlassesTrait",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "tuple",
				components: [
					{
						name: "storagePages",
						type: "tuple[]",
						components: [
							{
								name: "imageCount",
								type: "uint16",
							},
							{
								name: "decompressedLength",
								type: "uint80",
							},
							{
								name: "pointer",
								type: "address",
							},
						],
					},
					{
						name: "storedImagesCount",
						type: "uint256",
					},
				],
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "updateBodies",
		inputs: [
			{
				name: "encodedCompressed",
				type: "bytes",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "updateAccessories",
		inputs: [
			{
				name: "encodedCompressed",
				type: "bytes",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "updateHeads",
		inputs: [
			{
				name: "encodedCompressed",
				type: "bytes",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "updateGlasses",
		inputs: [
			{
				name: "encodedCompressed",
				type: "bytes",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "updateBodiesFromPointer",
		inputs: [
			{
				name: "pointer",
				type: "address",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "updateAccessoriesFromPointer",
		inputs: [
			{
				name: "pointer",
				type: "address",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "updateHeadsFromPointer",
		inputs: [
			{
				name: "pointer",
				type: "address",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "updateGlassesFromPointer",
		inputs: [
			{
				name: "pointer",
				type: "address",
			},
			{
				name: "decompressedLength",
				type: "uint80",
			},
			{
				name: "imageCount",
				type: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
] as const;
