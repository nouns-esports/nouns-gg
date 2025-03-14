"use client";

import { usePrivy } from "@privy-io/react-auth";
import Button from "./Button";
import { useModal } from "./Modal";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
	const { open: openSignInModal } = useModal("sign-in");
	const { ready, authenticated } = usePrivy();

	const router = useRouter();

	useEffect(() => {
		if (ready && authenticated) {
			router.refresh();
		}
	}, [ready, authenticated]);

	if (ready && !authenticated) {
		return (
			<div className="flex flex-col gap-4 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
				<h1 className="text-white text-2xl font-luckiest-guy">
					You must sign in to continue
				</h1>
				<Button onClick={openSignInModal}>Sign in</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4 text-white">
			Loading...
		</div>
	);
}
