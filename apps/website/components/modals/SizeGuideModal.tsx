import { X } from "lucide-react";
import { Modal, ToggleModal } from "../Modal";

export default function SizeGuideModal(props: { image: string }) {
	return (
		<Modal
			id="size-guide"
			className="p-4 flex flex-col max-w-[500px] w-full gap-4"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Size Guide
				</p>
				<ToggleModal
					id="size-guide"
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>
			<img
				src={`${props.image}?img-width=500&img-onerror=redirect`}
				alt="Size Guide"
				className="w-full rounded-lg"
			/>
		</Modal>
	);
}
