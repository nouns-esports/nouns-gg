import { createSafeActionClient } from "next-safe-action";
import { getAuthenticatedUser } from "../queries/users";
import { env } from "~/env";

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
	const admins = {
		production: [
			// Sam
			"did:privy:clx8g9mui0c1k10947grzks2a",
		],
		development: [
			// Sam
			"did:privy:clzmy1z8f03ehztrjkfwy9bne",
		],
	};

	if (!admins[env.NEXT_PUBLIC_ENVIRONMENT].includes(ctx.user.id)) {
		throw new Error("You must be an admin to complete this action");
	}

	return next();
});
