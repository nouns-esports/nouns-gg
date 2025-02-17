import { createAdminApiClient } from "@shopify/admin-api-client";
import { env } from "~/env";

export const shopifyClient = createAdminApiClient({
	storeDomain: "https://nounsesports.myshopify.com",
	apiVersion: "2025-01",
	accessToken: env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
});
