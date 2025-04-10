import { getTraitCounts, getTraits } from "@/server/queries/nouns";
import { padSVG } from "~/packages/utils/padSVG";
import { generateTraitsFromSeed } from "~/packages/utils/getTraitsFromSeed";

export async function GET(request: Request) {
	const url = new URL(request.url);

	const params = {
		user: url.searchParams.get("user"),
		id: url.searchParams.get("id"),
		accessory: url.searchParams.get("accessory"),
		body: url.searchParams.get("body"),
		head: url.searchParams.get("head"),
		glasses: url.searchParams.get("glasses"),
		background: url.searchParams.get("background"),
		seed: url.searchParams.get("seed"),
	};

	let background: string | undefined = undefined;
	let accessory: number | undefined = undefined;
	let body: number | undefined = undefined;
	let head: number | undefined = undefined;
	let glasses: number | undefined = undefined;

	if (params.seed && params.id) {
		return Response.json(
			{
				error: "Cannot specify both id and seed",
			},
			{ status: 400 },
		);
	}

	if (params.seed) {
		const counts = await getTraitCounts();

		const traits = generateTraitsFromSeed(params.seed, {
			accessoryCount: counts.accessory,
			bodyCount: counts.body,
			headCount: counts.head,
			glassesCount: counts.glasses,
			backgroundCount: 2,
		});

		background = traits.background === 0 ? "#d5d7e1" : "#e1d7d5";
		accessory = traits.accessory;
		body = traits.body;
		head = traits.head;
		glasses = traits.glasses;
	}

	if (params.accessory) {
		accessory = parseInt(params.accessory);
	}

	if (params.body) {
		body = parseInt(params.body);
	}

	if (params.head) {
		head = parseInt(params.head);
	}

	if (params.glasses) {
		glasses = parseInt(params.glasses);
	}

	if (params.background) {
		if (params.background.startsWith("#")) {
			if (params.background.length !== 7) {
				return Response.json(
					{ error: `Invalid background hex code: ${params.background}` },
					{ status: 400 },
				);
			}

			background = params.background;
		} else background = params.background === "0" ? "#d5d7e1" : "#e1d7d5";
	}

	if (!accessory) {
		return Response.json({ error: "Missing accessory" }, { status: 400 });
	}

	if (!body) {
		return Response.json({ error: "Missing body" }, { status: 400 });
	}

	if (!head) {
		return Response.json({ error: "Missing head" }, { status: 400 });
	}

	if (!glasses) {
		return Response.json({ error: "Missing glasses" }, { status: 400 });
	}

	if (!background) {
		return Response.json({ error: "Missing background" }, { status: 400 });
	}

	const traits = await getTraits({
		accessory,
		body,
		head,
		glasses,
	});

	if (!traits.accessory) {
		return Response.json(
			{ error: `Accessory not found: ${accessory}` },
			{ status: 400 },
		);
	}

	if (!traits.body) {
		return Response.json({ error: `Body not found: ${body}` }, { status: 400 });
	}

	if (!traits.head) {
		return Response.json({ error: `Head not found: ${head}` }, { status: 400 });
	}

	if (!traits.glasses) {
		return Response.json(
			{ error: `Glasses not found: ${glasses}` },
			{ status: 400 },
		);
	}

	const paddedAccessory = padSVG(
		traits.accessory.image,
		traits.accessory.padding,
	);
	const paddedBody = padSVG(traits.body.image, traits.body.padding);
	const paddedHead = padSVG(traits.head.image, traits.head.padding);
	const paddedGlasses = padSVG(traits.glasses.image, traits.glasses.padding);

	return new Response(
		`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none">
				<rect x="0" y="0" width="320" height="320" fill="${background}" />
				${paddedAccessory}
				${paddedBody}
				${paddedHead}
				${paddedGlasses}
			</svg>`,
		{
			status: 200,
			headers: {
				"Content-Type": "image/svg+xml",
			},
		},
	);
}
