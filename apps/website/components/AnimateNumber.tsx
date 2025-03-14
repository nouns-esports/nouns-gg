"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export function AnimatedNumber(props: {
	from: number;
	to: number;
	duration?: number;
	className?: string;
}) {
	const count = useMotionValue(props.from);

	// Transform the motion value to include commas and remove decimals
	const formattedCount = useTransform(count, (value) => {
		return Math.floor(value).toLocaleString("en-US");
	});

	// Animate on load
	useEffect(() => {
		const animation = animate(count, props.to, { duration: props.duration });

		// Clean up animation when component unmounts
		return animation.stop;
	}, [count, props.to, props.duration]);

	return (
		<motion.span className={props.className}>{formattedCount}</motion.span>
	);
}
