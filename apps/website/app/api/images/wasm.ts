import { initWasm } from "@resvg/resvg-wasm";
import path from "path";

export let isInitialized = false;

export async function init() {
	if (isInitialized) return;

	await initWasm(
		path.join(process.cwd(), "apps", "website", "public", "index_bg.wasm"),
	);

	isInitialized = true;
}
