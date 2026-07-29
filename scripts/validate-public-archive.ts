import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const dataRoot = join(root, "data/public/v1");
const websiteRoot = join(root, "apps/website");

if (!existsSync(dataRoot)) {
	throw new Error(`Public archive data is missing: ${dataRoot}`);
}

const forbiddenKeys = new Set([
	"email",
	"phone",
	"privyId",
	"privy_id",
	"linkedAccounts",
	"subject",
	"session",
	"secret",
	"password",
	"shopifyId",
	"stripeId",
	"address1",
	"address2",
	"consent",
	"deletedAt",
	"embedding",
]);

const allowedProfileKeys = new Set([
	"id",
	"name",
	"image",
	"bio",
	"twitter",
	"wallets",
]);
const allowedTwitterKeys = new Set([
	"username",
	"name",
	"profilePictureUrl",
]);
const allowedWalletKeys = new Set(["chain", "address", "kind"]);
const internalUuid =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let jsonFiles = 0;
let jsonBytes = 0;

for (const path of walk(dataRoot)) {
	if (extname(path) !== ".json") {
		throw new Error(`Only JSON is allowed in public data: ${path}`);
	}
	const contents = readFileSync(path, "utf8");
	jsonFiles += 1;
	jsonBytes += Buffer.byteLength(contents);
	const parsed = JSON.parse(contents);
	validateNode(parsed, path);
}

const profiles = JSON.parse(
	readFileSync(join(dataRoot, "profiles/index.json"), "utf8"),
) as Array<Record<string, unknown>>;
for (const [index, profile] of profiles.entries()) {
	assertExactKeys(profile, allowedProfileKeys, `profiles[${index}]`);
	if (
		typeof profile.id !== "string" ||
		!/^pub_[0-9a-f]{24}$/.test(profile.id)
	) {
		throw new Error(`profiles[${index}].id must be a derived public reference`);
	}
	if (profile.twitter) {
		assertExactKeys(
			profile.twitter as Record<string, unknown>,
			allowedTwitterKeys,
			`profiles[${index}].twitter`,
		);
	}
	if (!Array.isArray(profile.wallets)) {
		throw new Error(`profiles[${index}].wallets must be an array`);
	}
	for (const [walletIndex, wallet] of profile.wallets.entries()) {
		assertExactKeys(
			wallet as Record<string, unknown>,
			allowedWalletKeys,
			`profiles[${index}].wallets[${walletIndex}]`,
		);
		if ((wallet as Record<string, unknown>).kind !== "external") {
			throw new Error(`Only external wallets may be public`);
		}
	}
}

const forbiddenWebsiteImports = [
	/from ["']~\/packages\/db/,
	/from ["']@\/server\/mutations/,
	/from ["']@\/server\/actions/,
	/from ["']~\/env["']/,
	/from ["'][^"']*\/env["']/,
	/@privy-io\/(?:server-auth|react-auth)/,
	/from ["']next\/headers["']/,
];

const routeRoots = [
	join(websiteRoot, "app"),
	join(websiteRoot, "server/queries"),
	join(websiteRoot, "server/data"),
	join(websiteRoot, "providers/index.tsx"),
	join(websiteRoot, "components/Header.tsx"),
	join(websiteRoot, "components/proposals/Proposals.tsx"),
];
for (const routeRoot of routeRoots) {
	for (const path of walk(routeRoot)) {
		if (![".ts", ".tsx"].includes(extname(path))) continue;
		const source = readFileSync(path, "utf8");
		for (const pattern of forbiddenWebsiteImports) {
			if (pattern.test(source)) {
				throw new Error(`Forbidden archive import ${pattern} in ${path}`);
			}
		}
	}
}

const packageJson = readFileSync(join(websiteRoot, "package.json"), "utf8");
if (packageJson.includes("--env-file")) {
	throw new Error("Website scripts must not load private environment files");
}

console.log(
	`Validated ${jsonFiles.toLocaleString()} public JSON files (${(
		jsonBytes /
		1024 /
		1024
	).toFixed(1)} MiB) and ${profiles.length.toLocaleString()} public profiles.`,
);

function* walk(path: string): Generator<string> {
	const stat = lstatSync(path);
	if (stat.isSymbolicLink()) {
		throw new Error(`Symlinks are forbidden in public archive inputs: ${path}`);
	}
	if (stat.isFile()) {
		yield path;
		return;
	}
	for (const entry of readdirSync(path)) {
		yield* walk(join(path, entry));
	}
}

function validateNode(value: unknown, path: string) {
	if (Array.isArray(value)) {
		value.forEach((item, index) => validateNode(item, `${path}[${index}]`));
		return;
	}
	if (!value || typeof value !== "object") return;
	for (const [key, child] of Object.entries(value)) {
		if (key.startsWith("_") || forbiddenKeys.has(key)) {
			throw new Error(`Forbidden field ${path}.${key}`);
		}
		if (
			typeof child === "string" &&
			(child.includes("did:privy:") ||
				internalUuid.test(child) ||
				/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(child))
		) {
			throw new Error(`Forbidden value ${path}.${key}`);
		}
		validateNode(child, `${path}.${key}`);
	}
}

function assertExactKeys(
	value: Record<string, unknown>,
	allowed: Set<string>,
	path: string,
) {
	for (const key of Object.keys(value)) {
		if (!allowed.has(key)) {
			throw new Error(`Unexpected public field ${path}.${key}`);
		}
	}
}
