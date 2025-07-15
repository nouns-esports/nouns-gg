import { z } from "zod";
import type {
	accounts,
	communities,
	communityAdmins,
	communityConnections,
	leaderboards,
	nexus,
} from "~/packages/db/schema/public";

export type ActionDescription = Array<{
	text: string;
	href?: string;
	image?: string;
	highlight?: boolean;
}>;

export type Community = typeof communities.$inferSelect & {
	admins: (typeof communityAdmins.$inferSelect)[];
	connections: (typeof communityConnections.$inferSelect)[];
};

type User = typeof nexus.$inferSelect & {
	accounts: (typeof accounts.$inferSelect)[];
	leaderboards: Array<
		typeof leaderboards.$inferSelect & {
			community: typeof communities.$inferSelect;
		}
	>;
};

export function createAction<
	TSchema extends z.AnyZodObject = z.AnyZodObject,
>(action: {
	name: string;
	schema: TSchema;
	check: (props: {
		input: z.infer<TSchema>;
		user: User;
		community: Community;
	}) => Promise<boolean>;
}) {
	return {
		name: action.name,
		check: async (props: {
			input: z.infer<TSchema>;
			user: User;
			community: Community;
		}) => {
			const parsed = action.schema.safeParse(props.input);

			if (!parsed.success) {
				throw new Error(parsed.error.message);
			}

			return action.check(props);
		},
	};
}
