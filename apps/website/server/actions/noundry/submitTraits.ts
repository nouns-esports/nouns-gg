import { z } from "zod";
import { createAction } from "../createAction";
import { createFilter } from "../createFilter";

export const submitTraits = createAction({
    image: "",
    name: "Submit Traits",
    category: "noundry",
    generateDescription: async (inputs) => {
        "use server";

        const parts = [];

        if (inputs.count.value > 1) {
            parts.push({
                text: "Submit at least",
            });
            parts.push({
                text: inputs.count.value.toString(),
                highlight: true,
            });
            parts.push({
                text: "traits to",
            });
        } else {
            parts.push({
                text: "Submit a trait to",
            });
        }

        parts.push({
            text: "Noundry",
            href: "https://noundry.wtf",
        });

        return parts;
    },
    check: async ({ user, inputs }) => {
        "use server";

        if (user.wallets.length === 0) return false;

        try {
            const stats = await fetch("https://gallery.noundry.wtf/api/artists/stats").then(res => res.json()) as Array<{
                address: string;
                traits: number;
            }>;

            for (const wallet of user.wallets) {
                const artist = stats.find(artist => artist.address.toLowerCase() === wallet.address.toLowerCase());

                if (artist && artist.traits >= inputs.count.value) {
                    return true;
                }
            }
        } catch (e) {
            console.error("Error checking traits", e);
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
                    description: "The number of traits to submit",
                    schema: z.number().min(1),
                },
            },
        }),
    },
});