import { privyClient } from "@/server/clients/privy";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env";
import { accounts, nexus } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

type AccountType =
	| {
			type: "wallet";
			address: string;
	  }
	| {
			type: "twitter";
			username: string;
			subject: string;
	  }
	| {
			type: "discord";
			username: string;
			subject: string;
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
				const [nexusUser] = await db.primary
					.update(nexus)
					.set({
						twitter: verifiedPayload.account.username,
					})
					.where(eq(nexus.privyId, verifiedPayload.user.id))
					.returning();

				await db.primary.insert(accounts).values({
					platform: "twitter",
					identifier: verifiedPayload.account.subject,
					user: nexusUser.id,
				});
			}
			if (verifiedPayload.account.type === "discord") {
				const [nexusUser] = await db.primary
					.update(nexus)
					.set({
						discord: verifiedPayload.account.username.split("#")[0],
					})
					.where(eq(nexus.privyId, verifiedPayload.user.id))
					.returning();

				await db.primary.insert(accounts).values({
					platform: "discord",
					identifier: verifiedPayload.account.subject,
					user: nexusUser.id,
				});
			}
			if (verifiedPayload.account.type === "farcaster") {
				const [nexusUser] = await db.primary
					.update(nexus)
					.set({
						fid: verifiedPayload.account.fid,
					})
					.where(eq(nexus.privyId, verifiedPayload.user.id))
					.returning();

				await db.primary.insert(accounts).values({
					platform: "farcaster",
					identifier: verifiedPayload.account.fid.toString(),
					user: nexusUser.id,
				});
			}
		}

		if (verifiedPayload.type === "user.unlinked_account") {
			if (verifiedPayload.account.type === "twitter") {
				await db.primary
					.update(nexus)
					.set({
						twitter: null,
					})
					.where(eq(nexus.privyId, verifiedPayload.user.id));
			}
			if (verifiedPayload.account.type === "discord") {
				await db.primary
					.update(nexus)
					.set({
						discord: null,
					})
					.where(eq(nexus.privyId, verifiedPayload.user.id));
			}
			if (verifiedPayload.account.type === "farcaster") {
				await db.primary
					.update(nexus)
					.set({
						fid: null,
					})
					.where(eq(nexus.privyId, verifiedPayload.user.id));
			}
		}

		return NextResponse.json({ message: "ok" });
	} catch (e) {
		console.error(e);
	}

	return NextResponse.json({ message: "error" }, { status: 500 });
}
