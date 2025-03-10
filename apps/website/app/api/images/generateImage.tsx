import { initWasm } from "@resvg/resvg-wasm";
import { unstable_cache as cache } from "next/cache";
import path, { join } from "path";
import fs from "fs";
import { Resvg } from "@resvg/resvg-wasm";
import satori from "satori";

let isInitialized = false;

export const generateImage = cache(
	async (input: {
		image: React.ReactNode;
		size: {
			width: number;
			height: number;
		};
	}) => {
		if (!isInitialized) {
			const wasmBuffer = fs.readFileSync(
				path.join(process.cwd(), "public", "resvg.wasm"),
			);

			await initWasm(wasmBuffer);

			isInitialized = true;
		}

		const Cabin = fs.readFileSync(
			join(process.cwd(), "./public/fonts/Cabin-Regular.ttf"),
		);
		const LuckiestGuy = fs.readFileSync(
			join(process.cwd(), "./public/fonts/LuckiestGuy-Regular.ttf"),
		);
		const BebasNeue = fs.readFileSync(
			join(process.cwd(), "./public/fonts/BebasNeue-Regular.ttf"),
		);
		const LondrinaSolid = fs.readFileSync(
			join(process.cwd(), "./public/fonts/LondrinaSolid-Regular.ttf"),
		);

		return new Response(
			new Resvg(
				await satori(input.image, {
					width: input.size.width,
					height: input.size.height,
					fonts: [
						{
							name: "Cabin",
							data: Cabin,
							weight: 400,
							style: "normal",
						},
						{
							name: "Luckiest Guy",
							data: LuckiestGuy,
							weight: 400,
							style: "normal",
						},
						{
							name: "Bebas Neue",
							data: BebasNeue,
							weight: 400,
							style: "normal",
						},
						{
							name: "Londrina Solid",
							data: LondrinaSolid,
							weight: 400,
							style: "normal",
						},
					],
				}),
			)
				.render()
				.asPng(),
			{
				headers: {
					"Content-Type": "image/png",
				},
			},
		);
	},
	["generateImage"],
	{
		revalidate: 600,
	},
);
