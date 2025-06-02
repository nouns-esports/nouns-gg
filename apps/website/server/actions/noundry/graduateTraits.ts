import { z } from "zod";
import { createAction } from "../createAction";
import { createFilter } from "../createFilter";

export const graduateTraits = createAction({
    image: "",
    name: "Graduate Traits",
    category: "noundry",
    generateDescription: async (inputs) => {
        "use server";

        const parts = [];

        if (inputs.count.value > 1) {
            parts.push({
                text: "Graduate at least",
                highlight: true,
            });
            parts.push({
                text: inputs.count.value.toString(),
                highlight: true,
            });
            parts.push({
                text: "traits from",
            });
        } else {
            parts.push({
                text: "Graduate a trait from",
            });
        }

        parts.push({
            text: "Noundry",
            href: "https://noundry.wtf",
        });

        parts.push({
            text: "to Nouns",
        });

        return parts;
    },
    check: async ({ user, inputs }) => {
        "use server";

        if (user.wallets.length === 0) return false;

        const graduates = await fetch("https://gallery.noundry.wtf/api/graduations").then(res => res.json()) as Record<string, number | undefined>;

        for (const wallet of user.wallets) {
            const count = graduates[wallet.address.toLowerCase()];

            if (count && count >= inputs.count.value) {
                return true;
            }
        }

        return false;
    },
    filters: {
        count: createFilter({
            name: "Count",
            required: true,
            options: {
                value: {
                    name: "At least",
                    description: "The number of traits to graduate",
                    schema: z.number().min(1),
                },
            },
        }),
    },
});
