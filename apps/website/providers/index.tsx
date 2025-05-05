"use client";

import Privy from "@/providers/Privy";
import { Toaster } from "react-hot-toast";
import ReactQuery from "./ReactQuery";
import Farcaster from "./Farcaster";
import PostHog from "./PostHog";

export default function Providers(props: {
	user?: string;
	children: React.ReactNode;
}) {
	return (
		<Privy user={props.user}>
			<Farcaster>
				<ReactQuery>
					<PostHog>
						{props.children}
						<Toaster position="top-center" />
					</PostHog>
				</ReactQuery>
			</Farcaster>
		</Privy>
	);
}
