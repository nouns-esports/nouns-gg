import { z } from "zod";

z.object({
	place: z.number().optional().describe("The place to win"),
	round: z.number().describe("The round to win"),
});
