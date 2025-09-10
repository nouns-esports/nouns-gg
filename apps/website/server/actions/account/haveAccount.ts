import { createAction } from "../createAction";
import { z } from "zod";

export const haveAccount = createAction({
	name: "haveAccount",
	schema: z.object({}),
	check: async ({ input, user }) => {
		return true;
	},
});
