import { createSafeActionClient } from "next-safe-action";
import { getAuthenticatedUser } from "../queries/users";

export const actionClient = createSafeActionClient({
	handleServerError: (error) => {
		console.log("Action error: ", error.message);
		return error.message;
	},
});

export const onlyUser = actionClient.use(async ({ next }) => {
	const user = await getAuthenticatedUser();

	if (!user) {
		throw new Error("No user session found");
	}

	return next({
		ctx: {
			user,
		},
	});
});
