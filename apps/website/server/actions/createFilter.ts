import { z } from "zod";

export function createFilter<
	TOptions extends Record<
		string,
		{
			name: string;
			description: string;
			schema: z.ZodTypeAny;
			// internal?: boolean;
		}
	>,
	TRequired extends boolean = false,
>(props: {
	options: TOptions;
	name: string;
	required?: TRequired;
}): {
	options: TOptions;
	name: string;
	required: TRequired extends true ? true : false;
} {
	const { options, name, required } = props;
	return {
		options,
		name,
		required: (required ?? false) as TRequired extends true ? true : false,
	};
}
