// import { z } from "zod";
// import { createAction } from "../createAction";
// import { createFilter } from "../createFilter";

// const holdToken = createAction({
// 	image: "",
// 	name: "Hold Token",
// 	category: "onchain",
// 	generateDescription: () => {
// 		return [
// 			{
// 				text: "Hold a token",
// 			},
// 		];
// 	},
// 	check: async ({ user }) => {
// 		if (user.wallets.length === 0) return false;

// 		const balance = await db.primary.query.erc20Balances.findFirst({
// 			where: in(erc20Balances.address, user.wallets[0].address),
// 		});
// 	},
// 	filters: {
// 		token: createFilter({
// 			options: {
// 				token: {
// 					name: "Token",
// 					description: "The token to hold",
// 					schema: z.string(),
// 				},
// 			},
// 			name: "Token",
// 			required: true,
// 		}),
// 	},
// });
