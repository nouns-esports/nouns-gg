"use client";

import { useRouter } from "next/navigation";
import type { AuthenticatedUser } from "@/server/queries/users";
import { useModal } from "./Modal";
import SignInModal from "./modals/SignInModal";
import { twMerge } from "tailwind-merge";

export default function SignInButton(props: { user?: AuthenticatedUser }) {
	const router = useRouter();
	const { open } = useModal("sign-in");

	return (
		<>
			<button
				onClick={() => {
					if (props.user) {
						return router.push(
							`/users/${props.user?.nexus?.username ?? props.user.id}`,
						);
					}

					open();
				}}
				className={twMerge(
					"flex items-center gap-2 select-none text-grey-800 text-xl bg-white hover:bg-white/80 transition-colors rounded-full justify-center leading-none font-bebas-neue whitespace-nowrap",
					props.user?.nexus?.image ? "py-1.5 pl-1.5 pr-3" : "py-2.5 px-4",
				)}
			>
				{props.user?.nexus ? (
					<>
						<img
							src={props.user.nexus.image}
							alt="User avatar"
							className="rounded-full w-7 h-7 select-none object-center object-cover"
							draggable={false}
						/>
						{props.user.nexus.name}
						{props.user.nexus.rank ? (
							<img
								src={props.user.nexus.rank.image}
								alt={props.user.nexus.rank.name}
								className="w-5 h-5 object-contain max-[425px]:hidden"
							/>
						) : (
							""
						)}
					</>
				) : (
					"Sign in"
				)}
			</button>
			{!props.user?.nexus ? <SignInModal user={props.user} /> : null}
		</>
	);
}
