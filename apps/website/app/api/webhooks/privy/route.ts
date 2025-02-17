import { privyClient } from "@/server/clients/privy";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env";
import { db, nexus } from "~/packages/db/schema";

type AccountType =
	| {
			type: "wallet";
			address: string;
	  }
	| {
			type: "twitter";
			username: string;
	  }
	| {
			type: "discord";
			username: string;
	  }
	| {
			type: "farcaster";
			username: string;
			fid: number;
	  };

export async function POST(req: NextRequest) {
	const id = req.headers.get("svix-id") ?? "";
	const timestamp = req.headers.get("svix-timestamp") ?? "";
	const signature = req.headers.get("svix-signature") ?? "";

	const body = await req.json();

	try {
		const verifiedPayload = (await privyClient.verifyWebhook(
			body,
			{ id, timestamp, signature },
			env.PRIVY_WEBHOOK_SIGNING_KEY,
		)) as
			| {
					type: "user.authenticated";
					account: AccountType;
					user: {
						id: string;
					};
			  }
			| {
					type: "user.updated_account";
					account: AccountType;
					user: {
						id: string;
					};
			  }
			| {
					type: "user.linked_account";
					account: AccountType;
					user: {
						id: string;
					};
			  }
			| {
					type: "user.unlinked_account";
					account: AccountType;
					user: {
						id: string;
					};
			  };

		if (
			verifiedPayload.type === "user.authenticated" ||
			verifiedPayload.type === "user.updated_account" ||
			verifiedPayload.type === "user.linked_account"
		) {
			if (verifiedPayload.account.type === "twitter") {
				await db
					.update(nexus)
					.set({
						twitter: verifiedPayload.account.username,
					})
					.where(eq(nexus.id, verifiedPayload.user.id));
			}
			if (verifiedPayload.account.type === "discord") {
				await db
					.update(nexus)
					.set({
						discord: verifiedPayload.account.username.split("#")[0],
					})
					.where(eq(nexus.id, verifiedPayload.user.id));
			}
			if (verifiedPayload.account.type === "farcaster") {
				await db
					.update(nexus)
					.set({
						username: verifiedPayload.account.username,
						fid: verifiedPayload.account.fid,
					})
					.where(eq(nexus.id, verifiedPayload.user.id));
			}
		}

		if (verifiedPayload.type === "user.unlinked_account") {
			if (verifiedPayload.account.type === "twitter") {
				await db
					.update(nexus)
					.set({
						twitter: null,
					})
					.where(eq(nexus.id, verifiedPayload.user.id));
			}
			if (verifiedPayload.account.type === "discord") {
				await db
					.update(nexus)
					.set({
						discord: null,
					})
					.where(eq(nexus.id, verifiedPayload.user.id));
			}
			if (verifiedPayload.account.type === "farcaster") {
				await db
					.update(nexus)
					.set({
						username: null,
						fid: null,
					})
					.where(eq(nexus.id, verifiedPayload.user.id));
			}
		}

		return NextResponse.json({ message: "ok" });
	} catch (e) {
		console.error(e);
	}

	return NextResponse.json({ message: "error" }, { status: 500 });
}
