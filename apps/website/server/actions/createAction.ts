import type { AuthenticatedUser } from "@/server/queries/users";
import { z } from "zod";
import { createFilter } from "./createFilter";

export type ActionDescription = Array<{
	text: string;
	href?: string;
	image?: string;
	highlight?: boolean;
}>;

export function createAction<
	TFilters extends Record<string, ReturnType<typeof createFilter>>,
	TInputs extends {
		[K in keyof TFilters]: TFilters[K]["required"] extends true
			? {
					[O in keyof TFilters[K]["options"]]: z.infer<
						TFilters[K]["options"][O]["schema"]
					>;
				}
			:
					| {
							[O in keyof TFilters[K]["options"]]: z.infer<
								TFilters[K]["options"][O]["schema"]
							>;
					  }
					| undefined;
	},
>(init: {
	image: string;
	name: string;
	category: string;
	filters: TFilters;
	validateInputs?: (props: { inputs: TInputs; ctx: z.RefinementCtx }) => void;
	generateDescription: (inputs: TInputs) => Promise<ActionDescription>;
	check: (props: {
		user: AuthenticatedUser;
		inputs: TInputs;
	}) => Promise<boolean>;
}) {
	const schema = z.object(
		Object.fromEntries(
			Object.entries(init.filters).map(([key, filter]) => {
				const filterSchema = z.object(
					Object.fromEntries(
						Object.entries(filter.options).map(([optKey, opt]) => [
							optKey,
							opt.schema,
						]),
					),
				);
				return [key, filter.required ? filterSchema : filterSchema.optional()];
			}),
		),
	) as unknown as z.ZodType<TInputs, z.ZodTypeDef, TInputs>;

	function validateInputs(inputs: TInputs) {
		const parsedInput = schema
			.superRefine((arg, ctx) => {
				if (init.validateInputs) {
					init.validateInputs({ inputs: arg as TInputs, ctx });
				}
			})
			.parse(inputs);

		return parsedInput;
	}

	return {
		name: init.name,
		category: init.category,
		image: init.image,
		check: (props: {
			user: AuthenticatedUser;
			inputs: TInputs;
		}) => {
			const validatedInputs = validateInputs(props.inputs);

			return init.check({
				user: props.user,
				inputs: validatedInputs,
			});
		},
		validateInputs,
		generateDescription: init.generateDescription,
		filters: init.filters,
	};
}
