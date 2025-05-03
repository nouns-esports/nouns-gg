"use client";

import { posthog } from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { env } from "~/env";

export default function PostHog(props: { children: React.ReactNode }) {
	useEffect(() => {
		if (env.NEXT_PUBLIC_ENVIRONMENT === "production") {
			posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
				api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
				person_profiles: "identified_only",
				capture_pageview: false,
				capture_pageleave: true,
			});
		}
	}, []);

	return <PHProvider client={posthog}>{props.children}</PHProvider>;
}
