import { z } from "zod";

z.object({
	count: z.number().default(1).describe("The number of votes to receive"),
});
