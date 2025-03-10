import { unstable_cache as cache } from "next/cache";
import path, { join } from "path";
import fs from "fs";
import satori from "satori";
import { Transformer } from "@napi-rs/image";

export const generateImage = cache(
	async (input: {
		image: React.ReactNode;
		size: {
			width: number;
			height: number;
		};
	}) => {
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

		const svg = await satori(input.image, {
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
		});

		const transformer = Transformer.fromSvg(svg);

		return transformer.png();
	},
	["generateImage"],
	{
		revalidate: 600,
	},
);
