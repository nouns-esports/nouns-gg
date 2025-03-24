"use client";

import { useRouter } from "next/navigation";

export default function NavigateBack(
	props: React.ComponentProps<"button"> & { fallback: string },
) {
	const router = useRouter();

	return (
		<button
			onClick={() => {
				if (typeof window !== "undefined" && window.history.length > 1) {
					router.back();
				} else router.push(props.fallback);
			}}
			{...props}
		>
			{props.children}
		</button>
	);
}
