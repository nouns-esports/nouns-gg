import { createAction } from "../createAction";

export const linkEmail = createAction({
	create: async () => {
		return {
			description: <p>Link an email to your account</p>,
			url: "/user",
			check: async (user) => {
				if (!user.email) return false;

				return true;
			},
		};
	},
});
