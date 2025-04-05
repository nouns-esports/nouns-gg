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

export const onlyRanked = onlyUser.use(async ({ next, ctx }) => {
	if (!ctx.user.nexus?.rank) {
		throw new Error("User has not entered the Nexus");
	}

	return next();
});

export const onlyAdmin = onlyUser.use(async ({ next, ctx }) => {
	if (!ctx.user.nexus?.admin) {
		throw new Error("You must be an admin to complete this action");
	}

	return next();
});
