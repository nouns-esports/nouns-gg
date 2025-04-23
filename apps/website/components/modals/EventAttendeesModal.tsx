import { ArrowRight, X } from "lucide-react";
import { Modal, ToggleModal } from "../Modal";
import Link from "../Link";
import type { getEvent } from "@/server/queries/events";
export default function EventAttendeesModal(props: {
	attendees: NonNullable<Awaited<ReturnType<typeof getEvent>>>["attendees"];
}) {
	return (
		<Modal
			id="event-attendees"
			className="p-4 flex flex-col max-w-[400px] max-lg:max-w-none w-full gap-4"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Attendees
				</p>
				<ToggleModal
					id="event-attendees"
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>
			<div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
				{props.attendees.map((attendee, index) => (
					<div
						key={
							attendee.user.id === "_"
								? `attendee-modal-${index}`
								: attendee.user.id
						}
						className="flex items-center justify-between gap-2 px-4 py-3 bg-grey-800 rounded-xl"
					>
						<div className="flex items-center gap-4">
							<img
								src={attendee.user.image}
								className="w-10 h-10 rounded-full bg-white object-cover"
							/>
							<p className="text-white">{attendee.user.name}</p>
						</div>
						{attendee.user.id !== "_" ? (
							<Link
								href={`/users/${attendee.user.profile?.username ?? attendee.user.id}`}
								className="text-red group hover:text-red/70 transition-colors flex items-center gap-1"
							>
								View
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</Link>
						) : null}
					</div>
				))}
			</div>
		</Modal>
	);
}
