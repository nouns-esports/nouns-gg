"use server";

import { env } from "~/env";
import { onlyUser } from ".";
import { z } from "zod";

export const pinImage = onlyUser
	.schema(
		z.object({
			formData: z.any(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const image = parsedInput.formData.get("file") as File;

		// 10 MB in bytes
		if (image.size > 10 * 1024 * 1024) {
			throw new Error("Image is too large");
		}

		const response = await fetch(
			"https://api.pinata.cloud/pinning/pinFileToIPFS",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${env.PINATA_JWT}`,
				},
				body: parsedInput.formData,
			},
		);

		const data = (await response.json()) as { IpfsHash: string };

		if (!response.ok) {
			throw new Error("Could not upload file");
		}

		return data.IpfsHash;
	});
