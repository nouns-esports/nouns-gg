"use client";

import Privy from "@/providers/Privy";
import { Toaster } from "react-hot-toast";
import ReactQuery from "./ReactQuery";
import Wagmi from "./Wagmi";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { create } from "zustand";
import Farcaster from "./Farcaster";

const useFromExternalStore = create<{
	initialPath?: string;
	recentPath?: string;
	setInitialPath: (path: string) => void;
	setRecentPath: (path: string) => void;
}>((set) => ({
	initialPath: undefined,
	recentPath: undefined,
	setInitialPath: (path) => set({ initialPath: path }),
	setRecentPath: (path) => set({ recentPath: path }),
}));

export function useFromExternal() {
	const pathname = usePathname();
	const { initialPath, recentPath, setInitialPath, setRecentPath } =
		useFromExternalStore();

	useEffect(() => {
		if (!initialPath) {
			setInitialPath(pathname);
		} else if (initialPath !== pathname) {
			setRecentPath(pathname);
		}
	}, [pathname, initialPath, setInitialPath, setRecentPath]);

	return !recentPath;
}

export default function Providers(props: {
	user?: string;
	children: React.ReactNode;
}) {
	useFromExternal();

	return (
		<Privy user={props.user}>
			<Farcaster>
				<ReactQuery>
					<Wagmi>
						{props.children}
						<Toaster position="top-center" />
					</Wagmi>
				</ReactQuery>
			</Farcaster>
		</Privy>
	);
}
