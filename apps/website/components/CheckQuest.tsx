"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";
import { useTransition } from "react";
import { completeQuest } from "@/server/mutations/completeQuest";
import { useAction } from "next-safe-action/hooks";
import { toast } from "./Toasts";
import { useModal } from "./Modal";
import { confetti } from "@/utils/confetti";

export default function CheckQuest(props: {
	user: boolean;
	active: boolean;
	quest: number;
	xp: number;
	claimed: boolean;
	completed: boolean;
	userXP: number;
}) {
	const router = useRouter();

	const [isPending, startTransition] = useTransition();
	const completeQuestAction = useAction(completeQuest);
	const signInModal = useModal("sign-in");

	return (
		<Button
			disabled={props.active ? props.claimed : true}
			loading={isPending || completeQuestAction.isPending}
			onClick={async () => {
				if (!props.user) {
					return signInModal.open();
				}

				if (!props.completed) {
					return startTransition(() => router.refresh());
				}

				if (!props.claimed) {
					const result = await completeQuestAction.executeAsync({
						quest: props.quest,
					});

					if (result?.serverError) {
						return toast.error(result.serverError);
					}

					if (result?.data) {
						toast.xp({ total: result.data.newXP, earned: props.xp });
						toast.custom(result.data.notification);
					}

					confetti();
				}
			}}
			size="sm"
		>
			{props.user
				? props.completed
					? props.claimed
						? "Claimed"
						: "Claim"
					: "Check"
				: "Sign in"}
		</Button>
	);
}
