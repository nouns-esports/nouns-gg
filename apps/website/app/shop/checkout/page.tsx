import ArchiveNotice from "@/components/ArchiveNotice";

export default function Checkout() {
	return (
		<ArchiveNotice
			title="Checkout unavailable"
			description="Checkout is no longer available."
			backHref="/shop"
		/>
	);
}
