"use client";

import Privy from "@/providers/Privy";
import { Toaster } from "react-hot-toast";
import ReactQuery from "./ReactQuery";
import Farcaster from "./Farcaster";

export default function Providers(props: {
	user?: string;
	children: React.ReactNode;
}) {
	return (
		<Privy user={props.user}>
			<Farcaster>
				<ReactQuery>
					{props.children}
					<Toaster position="top-center" />
				</ReactQuery>
			</Farcaster>
		</Privy>
	);
}
