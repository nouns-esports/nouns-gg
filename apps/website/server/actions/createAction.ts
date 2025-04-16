import type { AuthenticatedUser } from "@/server/queries/users";
import { z } from "zod";

// rounds page: Requirements to vote (i) opens actions modal which takes in a list of actions and shows how to do them
export function createAction<
	T extends
		| z.ZodObject<any, any>
		| z.ZodDiscriminatedUnion<any, any>
		| z.ZodUnion<any>,
>(props: {
	schema?: T;
	create: (inputs: z.infer<T>) => Promise<{
		description: string | React.ReactNode;
		url: string;
		check: (user: AuthenticatedUser) => Promise<boolean>;
	}>;
}) {
	return {
		schema: props.schema,
		load: (inputs: z.infer<T>) => {
			if (props.schema) {
				const result = props.schema.safeParse(inputs);

				if (!result.success) {
					throw new Error("Invalid inputs");
				}
			}

			return props.create(inputs);
		},
	};
}
