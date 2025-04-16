import { createAction } from "../createAction";

export const linkFarcaster = createAction({
	create: async () => {
		return {
			description: <p>Link your Farcaster account</p>,
			url: "/user",
			check: async (user) => {
				if (!user.farcaster) return false;

				return true;
			},
		};
	},
});
