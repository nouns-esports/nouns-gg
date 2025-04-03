"use client";

import { confetti } from "@/utils/confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import {
	animate,
	motion,
	useDragControls,
	useMotionValue,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { create } from "zustand";

const useModalState = create<{
	open: Record<string, boolean>;
	setOpen: (id: string, open: boolean) => void;
}>((set) => ({
	open: {},
	setOpen: (id, open) => {
		set((state) => ({ open: { ...state.open, [id]: open } }));
	},
}));

export function useModal(id: string) {
	const { open, setOpen } = useModalState();

	const y = useMotionValue(0);

	const { width } = useWindowSize();
	const mobile = useMemo(() => !!((width ?? 0) <= 1024), [width]);

	return {
		isOpen: open[id],
		open: () => setOpen(id, true),
		close: () => {
			const backdrop = document.getElementById(`${id}-backdrop`);
			const modal = document.getElementById(`${id}-modal`);

			if (!backdrop) {
				console.error("No backdrop found for modal", `${id}-backdrop`);
				return;
			}

			if (!modal) {
				console.error("No modal found for modal", `${id}-modal`);
				return;
			}

			Promise.all([
				animate(
					backdrop,
					{ opacity: [1, 0] },
					{ duration: mobile ? 0.3 : 0.2, ease: "easeInOut" },
				),
				animate(
					modal,
					{
						y: [
							typeof y.get() === "number" ? y.get() : 0,
							modal.getBoundingClientRect().height / (mobile ? 1 : 10),
						],
					},
					{ duration: mobile ? 0.3 : 0.2, ease: "easeInOut" },
				),
			]).then(() => setOpen(id, false));
		},
		y,
	};
}

export function ToggleModal(props: {
	id: string;
	children: React.ReactNode;
	tabIndex?: number;
	className?: string;
}) {
	const { isOpen, open, close } = useModal(props.id);

	return (
		<div
			tabIndex={props.tabIndex}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				isOpen ? close() : open();
			}}
			className={twMerge("cursor-pointer", props.className)}
		>
			{props.children}
		</div>
	);
}

export function Modal(props: {
	id: string;
	children: React.ReactNode;
	className?: string;
	handle?: boolean;
	queryParam?: [string, string];
	confetti?: boolean;
	isOpen?: boolean;
}) {
	const { open, isOpen, close, y } = useModal(props.id);
	const { open: openModals } = useModalState();

	const openCount = useMemo(() => {
		return Object.values(openModals).filter((modal) => modal).length;
	}, [openModals]);

	useEffect(() => {
		if (props.isOpen) open();
	}, []);

	useEffect(() => {
		const root = document.documentElement;
		const url = new URL(window.location.toString());

		if (isOpen) {
			if (openCount === 1) {
				const width = root.clientWidth;
				root.classList.add("prevent-scroll");
				root.style.paddingRight = `${root.clientWidth - width}px`;
				if (props.confetti) confetti();
			}

			if (props.queryParam && !url.searchParams.get(props.queryParam[0])) {
				url.searchParams.set(props.queryParam[0], props.queryParam[1]);
				window.history.replaceState({}, "", url);
			}
		} else {
			if (openCount === 0) {
				root.classList.remove("prevent-scroll");
				root.style.paddingRight = "0px";
			}

			if (props.queryParam && url.searchParams.get(props.queryParam[0])) {
				url.searchParams.delete(props.queryParam[0]);
				window.history.replaceState({}, "", url);
			}
		}
	}, [isOpen]);

	const { width } = useWindowSize();
	const mobile = useMemo(() => !!((width ?? 0) <= 1024), [width]);

	const controls = useDragControls();

	if (isOpen) {
		return (
			<motion.div
				//@ts-ignore
				id={`${props.id}-backdrop`}
				onClick={() => close()}
				initial={{ opacity: 0 }}
				// animate={{ opacity: isOpen ? 1 : 0 }}
				animate={{ opacity: 1 }}
				transition={{
					duration: mobile ? 0.3 : 0.2,
					ease: "easeInOut",
				}}
				className={twMerge(
					"fixed z-[80] inset-0 bg-black/50 flex items-center justify-center max-lg:items-end backdrop-blur-sm",
					// isOpen ? "pointer-events-auto" : "pointer-events-none",
					// !mounted && "hidden"
				)}
			>
				<motion.div
					//@ts-ignore
					id={`${props.id}-modal`}
					initial={{ y: mobile ? "100%" : "10%" }}
					animate={{ y: isOpen ? "0%" : mobile ? "100%" : "10%" }}
					drag={mobile ? "y" : false}
					dragConstraints={{ top: 0, bottom: 0 }}
					dragElastic={{
						top: 0,
						bottom: 0.5,
					}}
					dragControls={props.handle ? controls : undefined}
					dragListener={props.handle ? false : undefined}
					style={{ y }}
					transition={{
						duration: mobile ? 0.3 : 0.2,
						ease: "easeInOut",
					}}
					onDragEnd={() => {
						if (y.get() >= 100) close();
					}}
					//@ts-ignore
					onClick={(e) => e.stopPropagation()}
					className={twMerge(
						"flex flex-col rounded-xl bg-black border border-grey-600 drop-shadow-2xl max-lg:rounded-b-none max-lg:border-b-0 max-lg:border-x-0 max-lg:w-full ",
						props.className,
					)}
				>
					{props.handle && (
						<div className="w-full items-center justify-center max-lg:flex hidden">
							<button
								onPointerDown={
									props.handle ? (e) => controls.start(e) : undefined
								}
								className="h-1.5 w-12 bg-grey-500 rounded-full cursor-grab active:cursor-grabbing touch-none"
							/>
						</div>
					)}
					{props.children}
				</motion.div>
			</motion.div>
		);
	}
}
