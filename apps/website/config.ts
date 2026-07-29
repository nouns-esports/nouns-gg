export const siteConfig = {
	archiveMode: true,
	environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? "production",
	domain: process.env.NEXT_PUBLIC_DOMAIN ?? "http://localhost:3000",
} as const;
