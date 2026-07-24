import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const website = resolve(import.meta.dir, "../apps/website");
const openNext = resolve(website, ".open-next");
const wranglerOutput = resolve(website, ".sites-wrangler");
const dist = resolve(website, "dist");

rmSync(wranglerOutput, { recursive: true, force: true });

const result = spawnSync(
	"bunx",
	["wrangler", "deploy", "--dry-run", "--outdir", wranglerOutput],
	{
		cwd: website,
		env: {
			...process.env,
			WRANGLER_LOG_PATH: resolve(wranglerOutput, "wrangler.log"),
			WRANGLER_SEND_METRICS: "false",
		},
		stdio: "inherit",
	},
);

if (result.status !== 0) {
	throw new Error(`Wrangler dry run failed with status ${result.status}`);
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(resolve(dist, "server"), { recursive: true });

cpSync(resolve(wranglerOutput, "worker.js"), resolve(dist, "server/index.js"));
for (const entry of readdirSync(wranglerOutput)) {
	if (entry === "worker.js" || entry === "worker.js.map" || entry === "README.md") {
		continue;
	}
	cpSync(resolve(wranglerOutput, entry), resolve(dist, "server", entry));
}

cpSync(resolve(openNext, "assets"), resolve(dist, "client"), {
	recursive: true,
});

console.log("Staged the Sites worker and static assets in apps/website/dist.");
