export default function Loading() {
	return (
		<div className="flex gap-2">
			<p>Loading</p>
			<div className="flex gap-1 py-2">
				<div className="h-[5px] w-[5px] bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
				<div className="h-[5px] w-[5px] bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
				<div className="h-[5px] w-[5px] bg-black rounded-full animate-bounce" />
			</div>
		</div>
	);
}
