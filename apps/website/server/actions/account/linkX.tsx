import { createAction } from "../createAction";

export const linkX = createAction({
	create: async () => {
		return {
			description: <p>Link your X account</p>,
			url: "/user",
			check: async (user) => {
				if (!user.twitter) return false;

				return true;
			},
		};
	},
});
