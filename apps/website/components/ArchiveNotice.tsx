import { CircleOff } from "lucide-react";
import Link from "./Link";

export default function ArchiveNotice(props: {
	title: string;
	description: string;
	backHref?: string;
}) {
	return (
		<div className="flex min-h-[70vh] w-full items-center justify-center px-4 pt-24">
			<div className="flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-white/10 bg-grey-800 p-8 text-center">
				<CircleOff className="h-10 w-10 text-red" />
				<h1 className="font-luckiest-guy text-3xl text-white">{props.title}</h1>
				<p className="text-grey-200">{props.description}</p>
				<Link
					href={props.backHref ?? "/"}
					className="mt-2 rounded-lg bg-red px-4 py-2 font-semibold text-white"
				>
					Go back
				</Link>
			</div>
		</div>
	);
}
