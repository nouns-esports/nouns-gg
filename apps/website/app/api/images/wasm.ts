import { initWasm } from "@resvg/resvg-wasm";
import path from "path";
import fs from "fs";

export let isInitialized = false;

export async function init() {
	if (isInitialized) return;

	const wasmBuffer = fs.readFileSync(
		path.join(process.cwd(), "public", "resvg.wasm"),
	);

	await initWasm(wasmBuffer);

	isInitialized = true;
}
