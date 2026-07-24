import ArchiveNotice from "@/components/ArchiveNotice";

export default async function EditProposal(props: {
	params: Promise<{ community: string; round: string }>;
}) {
	const params = await props.params;
	return (
		<ArchiveNotice
			title="Proposal unavailable"
			description="This proposal can no longer be edited."
			backHref={`/c/${params.community}/rounds/${params.round}`}
		/>
	);
}
