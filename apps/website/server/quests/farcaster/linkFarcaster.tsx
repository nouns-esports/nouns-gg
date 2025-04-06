import createAction from "../createAction";

export const linkFarcaster = createAction(async () => {
	return {
		description: <p>Link your Farcaster account</p>,
		url: "/user",
		check: async (user) => {
			if (!user.farcaster) return false;

			return true;
		},
	};
});
