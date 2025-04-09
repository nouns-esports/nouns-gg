import type { AuthenticatedUser } from "@/server/queries/users";

// rounds page: Requirements to vote (i) opens actions modal which takes in a list of actions and shows how to do them
// Use ZOD to parse and validate inputs
export default function createAction<T extends Record<string, any>>(
	create: (actionInputs: T) => Promise<{
		description: string;
		url: string;
		check: (user: AuthenticatedUser, actionInputs: T) => Promise<boolean>;
	}>,
) {
	return create;
}
