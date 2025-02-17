"use client";

import { Check, Mail, RefreshCcw, X } from "lucide-react";
import { Modal, ToggleModal, useModal } from "../Modal";
import type { AuthenticatedUser } from "@/server/queries/users";
import { useRef } from "react";
import { useState } from "react";
import { useLoginWithEmail } from "@privy-io/react-auth";
import Countdown from "../Countdown";
import { useRouter } from "next/navigation";
import { toast } from "../Toasts";
export default function LinkEmailModal() {
	const { close } = useModal("link-email");
	const [email, setEmail] = useState("");
	const [emailCode, setEmailCode] = useState({
		1: "",
		2: "",
		3: "",
		4: "",
		5: "",
		6: "",
	});
	// const [canReceiveEmails, setCanReceiveEmails] = useState(false);

	const router = useRouter();

	const code1 = useRef<HTMLInputElement>(null);
	const code2 = useRef<HTMLInputElement>(null);
	const code3 = useRef<HTMLInputElement>(null);
	const code4 = useRef<HTMLInputElement>(null);
	const code5 = useRef<HTMLInputElement>(null);
	const code6 = useRef<HTMLInputElement>(null);

	const { sendCode, loginWithCode, state } = useLoginWithEmail({
		onComplete: () => {
			toast.success("Successfully linked email");
			close();
			router.refresh();
		},
		onError: () => {
			toast.error("Something went wrong");
		},
	});

	const [emailCooldown, setEmailCooldown] = useState(new Date());

	const [verifying, setVerifying] = useState(false);

	return (
		<Modal
			id="link-email"
			className="p-4 flex flex-col max-w-[500px] w-80 gap-6"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					{verifying ? "Enter Confirmation Code" : "Link Email"}
				</p>
				<ToggleModal
					id="link-email"
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</ToggleModal>
			</div>
			{verifying ? (
				<p className="text-sm text-grey-200">
					Please check <span className="text-red">{email}</span> for an email
					and enter your code below.
				</p>
			) : (
				<p>Link an email to your nouns.gg account</p>
			)}
			{verifying ? (
				<div className="flex flex-col gap-6">
					<div className="flex items-center gap-2 w-full h-12 px-8">
						<input
							maxLength={1}
							ref={code1}
							type="text"
							onChange={(e) => {
								setEmailCode({ ...emailCode, 1: e.target.value });

								code2.current?.focus();
							}}
							className="bg-transparent border border-grey-600 rounded-md w-full h-full text-center text-2xl font-bebas-neue"
						/>
						<input
							maxLength={1}
							ref={code2}
							type="text"
							onChange={(e) => {
								setEmailCode({ ...emailCode, 2: e.target.value });

								code3.current?.focus();
							}}
							className="bg-transparent border border-grey-600 rounded-md w-full h-full text-center text-2xl font-bebas-neue"
						/>
						<input
							maxLength={1}
							ref={code3}
							type="text"
							onChange={(e) => {
								setEmailCode({ ...emailCode, 3: e.target.value });

								code4.current?.focus();
							}}
							className="bg-transparent border border-grey-600 rounded-md w-full h-full text-center text-2xl font-bebas-neue"
						/>
						<input
							maxLength={1}
							ref={code4}
							type="text"
							onChange={(e) => {
								setEmailCode({ ...emailCode, 4: e.target.value });

								code5.current?.focus();
							}}
							className="bg-transparent border border-grey-600 rounded-md w-full h-full text-center text-2xl font-bebas-neue"
						/>
						<input
							maxLength={1}
							ref={code5}
							type="text"
							onChange={(e) => {
								setEmailCode({ ...emailCode, 5: e.target.value });

								code6.current?.focus();
							}}
							className="bg-transparent border border-grey-600 rounded-md w-full h-full text-center text-2xl font-bebas-neue"
						/>
						<input
							maxLength={1}
							ref={code6}
							type="text"
							onChange={(e) => {
								setEmailCode({ ...emailCode, 6: e.target.value });
							}}
							className="bg-transparent border border-grey-600 rounded-md w-full h-full text-center text-2xl font-bebas-neue"
						/>
					</div>
					<button
						disabled={
							Object.values(emailCode).every((code) => !code) &&
							emailCooldown > new Date()
						}
						onClick={() => {
							const confirm = Object.values(emailCode).every((code) => !!code);

							if (confirm) {
								return loginWithCode({
									code: Object.values(emailCode).join(""),
								});
							}

							if (emailCooldown < new Date()) {
								sendCode({ email });
								setEmailCooldown(new Date(Date.now() + 1000 * 30));
							}
						}}
						className="flex disabled:opacity-70 disabled:pointer-events-none justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors"
					>
						{state.status === "submitting-code" ? (
							<img
								alt="loading spinner"
								src="/spinner.svg"
								className="h-[18px] animate-spin"
							/>
						) : (
							""
						)}
						{Object.values(emailCode).every((code) => !!code)
							? "Confirm"
							: "Resend"}
						{Object.values(emailCode).every((code) => !!code) ? (
							<Check className="w-4 h-4" />
						) : (
							<RefreshCcw className="w-4 h-4" />
						)}
					</button>
					{emailCooldown > new Date() && (
						<p className="w-full items-center justify-center gap-1 flex text-white text-sm">
							<span>Resend in</span>

							<Countdown date={emailCooldown} onlySeconds />
						</p>
					)}
				</div>
			) : (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (email.length > 0) {
							setVerifying(true);
							sendCode({ email });
							setEmailCooldown(new Date(Date.now() + 1000 * 30));
						}
					}}
					className="flex items-center gap-2 w-full text-white font-semibold border border-white/20 rounded-lg p-2.5"
				>
					<Mail className="w-6 h-6" />
					<input
						type="email"
						placeholder="example@email.com"
						required
						onChange={(e) => setEmail(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && email.length > 0) {
								setVerifying(true);
								sendCode({ email });
								setEmailCooldown(new Date(Date.now() + 1000 * 30));
							}
						}}
						value={email}
						className="bg-transparent outline-none w-full placeholder:text-white/50 text-white"
					/>
					<button
						type="submit"
						className="flex items-center gap-1 text-sm hover:text-white/70 transition-colors"
					>
						Submit
					</button>
				</form>
			)}
		</Modal>
	);
}
