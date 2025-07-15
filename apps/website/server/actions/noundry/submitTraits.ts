import { z } from "zod";
import { privyClient } from "../../clients/privy";
import { createAction } from "../createAction";

export const submitTraits = createAction({
	name: "Submit Traits",
	schema: z.object({
		count: z.number().min(1).describe("The number of traits to submit"),
	}),
	check: async ({ user, input }) => {
		const privyUser = await privyClient.getUserById(user.privyId);

		if (!privyUser) return false;

		const wallets = privyUser.linkedAccounts.filter(
			(account) => account.type === "wallet",
		);

		const stats = (await fetch(
			"https://gallery.noundry.wtf/api/artists/stats",
		).then((res) => res.json())) as Array<{
			address: string;
			traits: number;
		}>;

		for (const wallet of wallets) {
			const artist = stats.find(
				(artist) =>
					artist.address.toLowerCase() === wallet.address.toLowerCase(),
			);

			if (artist && artist.traits >= input.count) {
				return true;
			}
		}

		return false;
	},
});
