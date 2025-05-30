"use client";

import { useInterval } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";

export default function Refresh() {
	const router = useRouter();

	useInterval(() => {
		router.refresh();
	}, 10000); // 10 seconds

	return null;
}
