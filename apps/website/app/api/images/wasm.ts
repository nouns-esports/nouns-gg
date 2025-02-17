import { initWasm } from "@resvg/resvg-wasm";

export let isInitialized = false;

export async function init() {
	if (isInitialized) return;

	await initWasm(fetch("https://unpkg.com/@resvg/resvg-wasm/index_bg.wasm"));

	isInitialized = true;
}
