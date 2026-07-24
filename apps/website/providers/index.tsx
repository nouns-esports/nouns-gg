"use client";

import { Toaster } from "react-hot-toast";
import ReactQuery from "./ReactQuery";

export default function Providers(props: { children: React.ReactNode }) {
	return (
		<ReactQuery>
			{props.children}
			<Toaster position="top-center" />
		</ReactQuery>
	);
}
