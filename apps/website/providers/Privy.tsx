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
import { useLoginToFrame } from "@privy-io/react-auth/farcaster";
import frameSdk from "@farcaster/frame-sdk";
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
			<PrivySync user={props.user}>
				<FramesV2>
					<SmartWalletsProvider>{props.children}</SmartWalletsProvider>
				</FramesV2>
			</PrivySync>
		</PrivyProvider>
	);
}

function PrivySync(props: { children: React.ReactNode; user?: string }) {
	const { user, ready, authenticated } = usePrivy();
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

	return props.children;
}

function FramesV2(props: { children: React.ReactNode }) {
	const { ready, authenticated } = usePrivy();

	const { initLoginToFrame, loginToFrame } = useLoginToFrame();

	const [context, setContext] = useState<Awaited<typeof frameSdk.context>>();
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		async function login() {
			const { nonce } = await initLoginToFrame();
			const result = await frameSdk.actions.signIn({ nonce: nonce });

			await loginToFrame({
				message: result.message,
				signature: result.signature,
			});

			await frameSdk.actions.ready();
		}

		if (context && ready && !authenticated) {
			login();
		}
	}, [ready, authenticated, context]);

	useEffect(() => {
		async function load() {
			setContext(await frameSdk.context);
			setLoaded(true);
		}

		if (!loaded) load();
	}, [loaded]);

	return props.children;
}
