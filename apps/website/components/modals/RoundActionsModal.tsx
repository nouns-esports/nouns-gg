import { Check, X } from "lucide-react";
import { Modal, ToggleModal } from "../Modal";
import type { AuthenticatedUser } from "@/server/queries/users";
import { getRound } from "@/server/queries/rounds";
import { twMerge } from "tailwind-merge";
import Link from "../Link";

export default function RoundActionsModal(props: {
	type: "proposing" | "voting";
	user: AuthenticatedUser;
	actions: Array<
		NonNullable<Awaited<ReturnType<typeof getRound>>>["actions"][number] & {
			completed: boolean;
		}
	>;
}) {
	const requiredActions = props.actions.filter((action) => action.required);
	const optionalActions = props.actions.filter((action) => !action.required);

	return (
		<Modal
			id={`round-actions-${props.type}`}
			className="p-4 flex flex-col max-w-[700px] min-w-80 gap-4"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Requirements
				</p>
				<ToggleModal
					id={`round-actions-${props.type}`}
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>

			<ul className="flex flex-col gap-2">
				{requiredActions.map(async (action, index) => (
					<li
						key={`action-${index}`}
						className={twMerge(
							"relative bg-grey-600 rounded-xl p-3 flex gap-4 items-center text-white",
							action.completed && "opacity-60 pointer-events-none",
						)}
					>
						{action.completed ? (
							<div className="rounded-full bg-green w-7 h-7 flex items-center justify-center">
								<Check className="w-5 h-5 text-black/50" />
							</div>
						) : (
							<div className="rounded-full bg-black/60 h-7 w-7 flex items-center justify-center text-sm">
								{index + 1}
							</div>
						)}
						<div className="flex items-center gap-2">
							{action.description.map((part, index) => {
								const highlighed = part.highlight ?? !!part.href;
								const Component = part.href ? Link : "p";

								return (
									<Component
										key={`part-${index}`}
										// @ts-ignore
										href={part.href}
										newTab={!!part.href}
										className={twMerge(
											"text-white",
											part.href &&
												"cursor-pointer hover:bg-grey-400 transition-colors",
											highlighed && "px-2 py-0.5 rounded-md bg-grey-500 ",
										)}
									>
										{part.text}
									</Component>
								);
							})}
						</div>
					</li>
				))}
			</ul>

			{optionalActions.length > 0 ? (
				<p className="text-white font-cabin font-semibold leading-none">
					Earn more votes
				</p>
			) : null}

			{optionalActions.length > 0 ? (
				<ul className="flex flex-col gap-2">
					{optionalActions.map(async (action, index) => (
						<li
							key={`action-${index}`}
							className="flex gap-2 items-center w-full"
						>
							<div
								className={twMerge(
									"relative bg-grey-600 rounded-xl p-3 flex gap-4 items-center text-white w-full",
									action.completed && "opacity-60 pointer-events-none",
								)}
							>
								{action.completed ? (
									<div className="rounded-full bg-green w-7 h-7 flex items-center justify-center">
										<Check className="w-5 h-5 text-black/50" />
									</div>
								) : (
									<div className="rounded-full bg-black/60 h-7 w-7 flex items-center justify-center text-sm">
										{index + 1}
									</div>
								)}
								<div className="flex items-center gap-2">
									{action.description.map((part, index) => {
										const highlighed = part.highlight ?? !!part.href;
										const Component = part.href ? Link : "p";

										return (
											<Component
												key={`part-${index}`}
												// @ts-ignore
												href={part.href}
												newTab={!!part.href}
												className={twMerge(
													"text-white",
													part.href &&
														"cursor-pointer hover:bg-grey-400 transition-colors",
													highlighed && "px-2 py-0.5 rounded-md bg-grey-500 ",
												)}
											>
												{part.text}
											</Component>
										);
									})}
								</div>
							</div>
							<p className="bg-grey-600 rounded-xl p-3 flex gap-4 items-center text-white whitespace-nowrap">
								+ {action.votes}
							</p>
						</li>
					))}
				</ul>
			) : null}
		</Modal>
	);
}
