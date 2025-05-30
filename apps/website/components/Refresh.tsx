"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Refresh() {
	const router = useRouter();

	useInterval(() => {
		router.refresh();
	}, 10000); // 10 seconds

	return null;
}

export function useInterval(callback: () => void, delay: number | null) {
	const saved = useRef<() => void>(() => {});

	useEffect(() => {
		saved.current = callback;
	}, [callback]);

	useEffect(() => {
		if (delay === null) return;
		const id = setInterval(() => saved.current(), delay);
		return () => clearInterval(id);
	}, [delay]);
}
