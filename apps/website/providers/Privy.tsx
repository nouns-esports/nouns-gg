"use client";

import {
	getAccessToken,
	PrivyProvider,
	usePrivy,
	type PrivyClientConfig,
	type WalletListEntry,
} from "@privy-io/react-auth";
import { env } from "~/env";
import { base, baseSepolia } from "viem/chains";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
// import { useLoginToFrame } from "@privy-io/react-auth/farcaster";
// import frameSdk from "@farcaster/frame-sdk";
import { useRouter } from "next/navigation";

export const usePrivyModalState = create<{
	loginMethods?: PrivyClientConfig["loginMethods"];
	externalWallets?: PrivyClientConfig["externalWallets"];
	walletList?: WalletListEntry[];
	setPrivyModalState: (
		state: Partial<{
			loginMethods: PrivyClientConfig["loginMethods"];
			externalWallets: PrivyClientConfig["externalWallets"];
			walletList: WalletListEntry[];
		}>,
	) => void;
}>((set) => ({
	loginMethods: ["discord", "twitter", "wallet", "farcaster", "email"],
	externalWallets: {
		coinbaseWallet: {
			connectionOptions: "all",
		},
	},
	walletList: undefined,
	setPrivyModalState: (state) => set(state),
}));

export default function Privy(props: {
	user?: string;
	children: React.ReactNode;
}) {
	const { loginMethods, walletList, externalWallets } = usePrivyModalState();

	return (
		<PrivyProvider
			appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
			config={{
				loginMethods,
				defaultChain:
					env.NEXT_PUBLIC_ENVIRONMENT === "production" ? base : baseSepolia,
				supportedChains: [
					env.NEXT_PUBLIC_ENVIRONMENT === "production" ? base : baseSepolia,
				],
				appearance: {
					theme: "#040404",
					accentColor: "#E93737",
					logo: "/logo/logo.svg",
					walletList,
				},

				externalWallets,
			}}
		>
			<FramesV2>
				<SmartWalletsProvider>{props.children}</SmartWalletsProvider>
			</FramesV2>
		</PrivyProvider>
	);
}

function FramesV2(props: { children: React.ReactNode; user?: string }) {
	const { user, ready, authenticated } = usePrivy();
	// const { initLoginToFrame, loginToFrame } = useLoginToFrame();

	// const [context, setContext] = useState<Awaited<typeof frameSdk.context>>();
	// const [isSDKLoaded, setIsSDKLoaded] = useState(false);

	const router = useRouter();

	useEffect(() => {
		async function refresh() {
			const token = await getAccessToken();

			if (token) {
				router.refresh();
			}
		}

		if (ready && authenticated && !props.user) {
			refresh();
		}
	}, [ready, authenticated, user]);

	// // Login to Frame with Privy automatically
	// useEffect(() => {
	// 	if (ready && !authenticated) {
	// 		const login = async () => {
	// 			const { nonce } = await initLoginToFrame();
	// 			try {
	// 				// Attempt to login to Frame (throws if not from a Warpcast frame)
	// 				const result = await frameSdk.actions.signIn({ nonce: nonce });
	// 				await loginToFrame({
	// 					message: result.message,
	// 					signature: result.signature,
	// 				});
	// 			} catch (error) {
	// 				// Frame doesn't exist (this request isn't from inside of Warpcast)
	// 				console.log("frame signin error", error);
	// 			}
	// 		};

	// 		login();
	// 	} else if (ready && authenticated) {
	// 	}
	// }, [ready, authenticated]);

	// // Initialize the frame SDK
	// useEffect(() => {
	// 	const load = async () => {
	// 		setContext(await frameSdk.context);
	// 		frameSdk.actions.ready({});
	// 	};
	// 	if (frameSdk && !isSDKLoaded) {
	// 		setIsSDKLoaded(true);
	// 		load();
	// 	}
	// }, [isSDKLoaded]);

	return props.children;
}
