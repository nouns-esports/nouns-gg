"use client";

import { useEffect, useRef, useState } from "react";

export default function GoldSlider(props: {
	min: number;
	max: number;
	value: number;
	onChange: (value: number) => void;
}) {
	const { min, max, value, onChange } = props;
	const trackRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const getValueFromPosition = (position: number) => {
		if (!trackRef.current) return min;

		const trackRect = trackRef.current.getBoundingClientRect();
		const trackWidth = trackRect.width;

		// Calculate percentage of position within track
		const percentage = Math.max(0, Math.min(1, position / trackWidth));

		// Convert percentage to value within min/max range
		return Math.round(min + percentage * (max - min));
	};

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging || !trackRef.current) return;

			const trackRect = trackRef.current.getBoundingClientRect();
			const position = e.clientX - trackRect.left;
			onChange(getValueFromPosition(position));
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (!isDragging || !trackRef.current) return;

			const trackRect = trackRef.current.getBoundingClientRect();
			const position = e.touches[0].clientX - trackRect.left;
			onChange(getValueFromPosition(position));
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("touchmove", handleTouchMove);
			window.addEventListener("mouseup", handleMouseUp);
			window.addEventListener("touchend", handleMouseUp);
		}

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("touchmove", handleTouchMove);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("touchend", handleMouseUp);
		};
	}, [isDragging, onChange]);

	// Calculate the percentage of the track that should be filled
	const fillPercentage = max === min ? 0 : ((value - min) / (max - min)) * 100;
	// Calculate the thumb position to align with the left edge at the correct position
	const thumbPosition = max === min ? 0 : Math.max(0, fillPercentage);

	return (
		<div className="h-8 flex items-center">
			<fieldset className="relative w-full border-0 p-0 m-0">
				<legend className="sr-only">Gold amount slider</legend>
				<div
					ref={trackRef}
					className="h-2 rounded-full bg-black/25"
					onMouseDown={(e) => {
						e.preventDefault();
						setIsDragging(true);

						if (trackRef.current) {
							const trackRect = trackRef.current.getBoundingClientRect();
							const position = e.clientX - trackRect.left;
							onChange(getValueFromPosition(position));
						}
					}}
					onTouchStart={(e) => {
						e.preventDefault();
						setIsDragging(true);

						if (trackRef.current) {
							const trackRect = trackRef.current.getBoundingClientRect();
							const position = e.touches[0].clientX - trackRect.left;
							onChange(getValueFromPosition(position));
						}
					}}
					style={{ position: "relative", width: "100%" }}
				>
					<div
						className="bg-gold-500 absolute top-0 left-0 h-full"
						style={{ width: `${fillPercentage}%`, borderRadius: "inherit" }}
					/>

					<div
						role="slider"
						tabIndex={0}
						aria-valuemin={min}
						aria-valuemax={max}
						aria-valuenow={value}
						aria-valuetext={`${value} gold`}
						style={{
							position: "absolute",
							top: "50%",
							left: `${thumbPosition}%`,
							transform: `translate(${thumbPosition === 100 ? "-100%" : thumbPosition === 0 ? "0" : "-50%"}, -50%)`,
							touchAction: "none",
						}}
						onKeyDown={(e) => {
							const step = 1;
							if (e.key === "ArrowRight" || e.key === "ArrowUp") {
								e.preventDefault();
								onChange(Math.min(max, value + step));
							} else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
								e.preventDefault();
								onChange(Math.max(min, value - step));
							} else if (e.key === "Home") {
								e.preventDefault();
								onChange(min);
							} else if (e.key === "End") {
								e.preventDefault();
								onChange(max);
							} else if (e.key === "PageUp") {
								e.preventDefault();
								onChange(Math.min(max, value + 10));
							} else if (e.key === "PageDown") {
								e.preventDefault();
								onChange(Math.max(min, value - 10));
							}
						}}
						onFocus={() => {
							// Add focus styles if needed
						}}
						onBlur={() => {
							// Remove focus styles if needed
						}}
					>
						<div
							className="h-8 w-8 rounded-full bg-contain bg-no-repeat bg-center cursor-pointer"
							style={{
								backgroundImage: `url('https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu')`,
							}}
						/>
					</div>
				</div>
			</fieldset>
		</div>
	);
}
