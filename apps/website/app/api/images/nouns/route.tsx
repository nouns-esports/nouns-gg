import { getNoun, getTrait } from "@/server/queries/nouns";
import { padSVG } from "~/packages/utils/padSVG";

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
	};

	if (
		params.accessory ||
		params.body ||
		params.head ||
		params.glasses ||
		params.background
	) {
		if (
			!(
				params.accessory &&
				params.body &&
				params.head &&
				params.glasses &&
				params.background
			)
		) {
			return Response.json(
				{ error: "When specifying a trait, you must specify all traits" },
				{ status: 400 },
			);
		}

		const [accessory, body, head, glasses] = await Promise.all([
			getTrait({ type: "accessory", index: Number(params.accessory) }),
			getTrait({ type: "body", index: Number(params.body) }),
			getTrait({ type: "head", index: Number(params.head) }),
			getTrait({ type: "glasses", index: Number(params.glasses) }),
		]);

		if (!accessory) {
			return Response.json(
				{ error: `Accessory ${params.accessory} not found` },
				{ status: 400 },
			);
		}

		if (!body) {
			return Response.json(
				{ error: `Body ${params.body} not found` },
				{ status: 400 },
			);
		}

		if (!head) {
			return Response.json(
				{ error: `Head ${params.head} not found` },
				{ status: 400 },
			);
		}

		if (!glasses) {
			return Response.json(
				{ error: `Glasses ${params.glasses} not found` },
				{ status: 400 },
			);
		}

		let background = undefined;

		if (typeof params.background === "number") {
			if (params.background === 0) background = "#d5d7e1";
			if (params.background === 1) background = "#e1d7d5";
		}

		if (
			typeof params.background === "string" &&
			params.background.startsWith("#")
		) {
			background = params.background;
		}

		if (!background) {
			return Response.json(
				{ error: `Invalid background: ${params.background}` },
				{ status: 400 },
			);
		}

		const paddedAccessory = padSVG(accessory.image, accessory.padding);
		const paddedBody = padSVG(body.image, body.padding);
		const paddedHead = padSVG(head.image, head.padding);
		const paddedGlasses = padSVG(glasses.image, glasses.padding);

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

	const noun = await getNoun({ id: params.id ? BigInt(params.id) : undefined });

	if (!noun) {
		return Response.json({ error: "Noun not found" }, { status: 400 });
	}

	const paddedAccessory = padSVG(noun.accessory.image, noun.accessory.padding);
	const paddedBody = padSVG(noun.body.image, noun.body.padding);
	const paddedHead = padSVG(noun.head.image, noun.head.padding);
	const paddedGlasses = padSVG(noun.glasses.image, noun.glasses.padding);

	return new Response(
		`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none">
            <rect x="0" y="0" width="320" height="320" fill="${noun.background}" />
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
