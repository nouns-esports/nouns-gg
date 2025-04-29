"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

export default function CapturePageView() {
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

			console.log("Capturing pageview", url);
			posthog.capture("$pageview", { $current_url: url });
		}
	}, [pathname, searchParams, posthog]);

	return null;
}
