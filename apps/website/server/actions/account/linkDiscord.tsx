import { createAction } from "../createAction";

export const linkDiscord = createAction({
	create: async () => {
		return {
			description: <p>Link your Discord account</p>,
			url: "/user",
			check: async (user) => {
				if (!user.discord) return false;

				return true;
			},
		};
	},
});
