"use client";

import { usePrivy } from "@privy-io/react-auth";
import { usePathname, useSearchParams } from "next/navigation";
import { posthog } from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect } from "react";
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

	return (
		<PHProvider client={posthog}>
			<SuspendedPageView />
			{props.children}
		</PHProvider>
	);
}

function CapturePageView() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const posthog = usePostHog();
	const { user } = usePrivy();

	useEffect(() => {
		if (user) {
			posthog.identify(user.id);
		}
	}, [user]);

	useEffect(() => {
		if (pathname && posthog) {
			let url = window.origin + pathname;

			if (searchParams.toString()) {
				url += `?${searchParams.toString()}`;
			}

			posthog.capture("$pageview", { $current_url: url });
		}
	}, [pathname, searchParams, posthog]);

	return null;
}

// Wrap this in Suspense to avoid the `useSearchParams` usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPageView() {
	return (
		<Suspense fallback={null}>
			<CapturePageView />
		</Suspense>
	);
}
