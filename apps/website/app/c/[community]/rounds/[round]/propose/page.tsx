import ArchiveNotice from "@/components/ArchiveNotice";

export default async function Propose(props: {
	params: Promise<{ community: string; round: string }>;
}) {
	const params = await props.params;
	return (
		<ArchiveNotice
			title="Proposal creation unavailable"
			description="New proposals can no longer be created."
			backHref={`/c/${params.community}/rounds/${params.round}`}
		/>
	);
}
