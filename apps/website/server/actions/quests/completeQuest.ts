import { z } from "zod";

z.object({
	quest: z.number().describe("The quest to complete"),
});
