import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const dist = resolve(import.meta.dir, "../apps/website/dist");
const worker = join(dist, "server/index.js");
const client = join(dist, "client");

if (!existsSync(worker) || !existsSync(client)) {
	throw new Error("Sites build is incomplete; expected a worker and client assets");
}

const forbiddenBuildValues = [
	"GOOGLE_API_KEY",
	"PRIVY_APP_SECRET",
	"PRIVY_VERIFICATION_KEY",
	"PRIVY_WEBHOOK_SIGNING_KEY",
	"DATABASE_URL",
	"PGPOOL_URL",
	"PRIMARY_DATABASE_URL",
	"NEXT_PUBLIC_PRIVY_APP_ID",
	"NEXT_PUBLIC_POSTHOG_KEY",
	"did:privy:",
	"postgres://",
	"postgresql://",
];

let files = 0;
for (const path of walk(dist)) {
	if (![".js", ".json", ".html", ".rsc", ".txt"].includes(extname(path))) {
		continue;
	}
	files += 1;
	const source = readFileSync(path, "utf8");
	for (const forbidden of forbiddenBuildValues) {
		if (source.includes(forbidden)) {
			throw new Error(`Forbidden private-runtime marker ${forbidden} in ${path}`);
		}
	}
}

console.log(`Validated ${files.toLocaleString()} credential-free Sites files.`);

function* walk(path: string): Generator<string> {
	const stat = lstatSync(path);
	if (stat.isFile()) {
		yield path;
		return;
	}
	for (const entry of readdirSync(path)) {
		yield* walk(join(path, entry));
	}
}
