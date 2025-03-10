import { initWasm } from "@resvg/resvg-wasm";

export let isInitialized = false;

export async function init() {
	if (isInitialized) return;

	await initWasm("./resvg.wasm");

	isInitialized = true;
}
