import { initWasm } from "@resvg/resvg-wasm";
import path from "path";
import fs from "fs";

export let isInitialized = false;

export async function init() {
	if (isInitialized) return;

	const wasmPath = path.join(process.cwd(), "public", "resvg.wasm");
	console.log("WASM PATH", wasmPath);
	const wasmBuffer = fs.readFileSync(wasmPath);

	await initWasm(wasmBuffer);

	isInitialized = true;
}
