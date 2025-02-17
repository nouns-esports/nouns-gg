"use client";

import { useEffect, useRef, useState } from "react";
import { Modal, ToggleModal, useModal } from "../Modal";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	ChevronRight,
	Edit,
	Mail,
	RefreshCcw,
	X,
} from "lucide-react";
import { DiscordLogo, TwitterLogo, Wallet } from "phosphor-react-sc";
import Link from "../Link";
import {
	useLogin,
	useLoginWithEmail,
	useLoginWithOAuth,
	usePrivy,
} from "@privy-io/react-auth";
import { usePrivyModalState } from "@/providers/Privy";
// import { toast } from "../Toasts";
// import { pinImage } from "@/server/mutations/pinImage";
// import { useAction } from "next-safe-action/hooks";
import type { AuthenticatedUser } from "@/server/queries/users";
// import { createNexus } from "@/server/mutations/createNexus";
import Countdown from "../Countdown";

export default function SignInModal(props: { user?: AuthenticatedUser }) {
	const [returningUser, setReturningUser] = useState(true);
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

	const code1 = useRef<HTMLInputElement>(null);
	const code2 = useRef<HTMLInputElement>(null);
	const code3 = useRef<HTMLInputElement>(null);
	const code4 = useRef<HTMLInputElement>(null);
	const code5 = useRef<HTMLInputElement>(null);
	const code6 = useRef<HTMLInputElement>(null);

	const [section, setSection] = useState<"start" | "wallets" | "email">(
		"start",
	);

	// const { isOpen, close, open } = useModal("sign-in");

	const { sendCode, loginWithCode, state } = useLoginWithEmail();
	const [emailCooldown, setEmailCooldown] = useState(new Date());
	const { loading, initOAuth } = useLoginWithOAuth();

	// const { user } = usePrivy();

	// useEffect(() => {
	// 	if (props.user) {
	// 		if (!props.user.nexus) {
	// 			setSection("profile");
	// 			open();
	// 		} else close();
	// 	}
	// }, [props.user]);

	const { login } = useLogin();
	const { setPrivyModalState } = usePrivyModalState();

	// const [image, setImage] = useState(
	// 	user?.farcaster?.pfp ??
	// 		`https://api.cloudnouns.com/v1/pfp?text=${Math.random().toString(36).substring(7)}&background=1`,
	// );
	// const [name, setName] = useState(
	// 	user?.farcaster?.displayName ??
	// 		user?.discord?.username?.split("#")[0] ??
	// 		user?.twitter?.name ??
	// 		"",
	// );
	// const [bio, setBio] = useState(user?.farcaster?.bio ?? "");

	// const pinImageAction = useAction(pinImage);

	// const createNexusAction = useAction(createNexus, {
	// 	onSuccess: () => {
	// 		close();
	// 	},
	// });

	return (
		<Modal id="sign-in" className="gap-4 w-[400px] overflow-hidden">
			<div className="flex flex-col">
				<div className="relative flex items-center justify-center flex-shrink-0 h-48 w-full">
					<img
						alt="Sign in banner"
						src="https://ipfs.nouns.gg/ipfs/QmSGYg5t25SQDp1xBw5tqDrfsF62T2HHVZpH4VduaAwJkT?img-height=200&img-onerror=redirect"
						className="w-full h-full object-cover brightness-75"
						draggable={false}
					/>
					{section === "wallets" || section === "email" ? (
						<button
							onClick={() => setSection("start")}
							className="absolute top-4 left-4 p-2 rounded-full bg-black/60 hover:bg-black transition-colors"
						>
							<ArrowLeft className="w-4 h-4 text-white" />
						</button>
					) : (
						""
					)}
					<ToggleModal
						id="sign-in"
						className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black transition-colors"
					>
						<X className="w-4 h-4 text-white" />
					</ToggleModal>
					<div className="absolute bottom-0 left-0 from-black to-transparent bg-gradient-to-t w-full h-16" />
				</div>
				<div className="flex flex-col justify-between h-full pt-4 pb-6 px-6">
					{
						{
							start: (
								<div className="flex flex-col gap-4">
									<p className="text-3xl font-bebas-neue text-white leading-none">
										{returningUser ? "Sign in" : "Create account"}
									</p>
									<div className="flex flex-col gap-3">
										<form
											onSubmit={(e) => {
												e.preventDefault();
												if (email.length > 0) {
													setSection("email");
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
														setSection("email");
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
										<button
											onClick={() => initOAuth({ provider: "discord" })}
											className="flex items-center gap-2 w-full text-white font-semibold bg-discord rounded-lg p-2.5 hover:bg-discord/70 transition-colors"
										>
											<DiscordLogo className="w-6 h-6" weight="fill" />
											Continue with Discord
										</button>
										<button
											onClick={() => {
												setPrivyModalState({ loginMethods: ["farcaster"] });
												login();
											}}
											className="flex items-center gap-2 w-full text-white font-semibold bg-farcaster rounded-lg p-2.5 hover:bg-farcaster/70 transition-colors"
										>
											<img
												alt="Farcaster logo"
												src="/farcaster.svg"
												className="w-5 h-5 mr-0.5 ml-0.5 object-contain"
											/>
											Continue with Farcaster
										</button>
										<button
											onClick={() => initOAuth({ provider: "twitter" })}
											className="flex items-center gap-2 w-full text-white font-semibold bg-twitter rounded-lg p-2.5 hover:bg-twitter/70 transition-colors"
										>
											<TwitterLogo className="w-6 h-6" weight="fill" />
											Continue with Twitter
										</button>
										<button
											onClick={() => {
												setPrivyModalState({ loginMethods: ["wallet"] });
												login();
											}}
											className="flex items-center justify-between w-full bg-white rounded-lg p-2.5 hover:bg-white/70 transition-colors group"
										>
											<div className="flex items-center gap-2 text-black font-semibold">
												<Wallet className="w-6 h-6" weight="fill" />
												Continue with Wallet
											</div>
											<ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1 text-black" />
										</button>
									</div>

									<p
										onClick={() => setReturningUser(!returningUser)}
										className="flex items-center gap-1 group text-red cursor-pointer w-min text-nowrap"
									>
										{returningUser
											? "Create a new account"
											: "Sign into an existing account"}
										<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
									</p>
									<small className="text-xs">
										By signing in, you agree to the{" "}
										<Link href="/terms" className="text-white hover:underline">
											Terms of Service
										</Link>{" "}
										and{" "}
										<Link
											href="/privacy"
											className="text-white hover:underline"
										>
											Privacy Policy
										</Link>
									</small>
								</div>
							),
							wallets: (
								<div className="flex flex-col gap-4">
									<p className="text-3xl font-bebas-neue text-white leading-none">
										Choose a wallet
									</p>
									<div className="flex flex-col gap-3">
										<button className="flex items-center gap-2 w-full text-white bg-gradient-to-tr from-metamask-dark to-metamask-light font-semibold rounded-lg p-2.5 transition-colors">
											<img
												alt="Metamask logo"
												src="/wallets/no-bg/metamask.svg"
												className="w-5 h-5 mr-0.5 ml-0.5 object-contain rounded-md"
											/>
											Metamask
										</button>
										<button className="flex items-center gap-2 w-full text-white bg-coinbase-wallet font-semibold rounded-lg p-2.5 transition-colors">
											<img
												alt="Coinbase wallet logo"
												src="/wallets/no-bg/coinbase_wallet.svg"
												className="w-5 h-5 mr-0.5 ml-0.5 object-contain rounded-md"
											/>
											Coinbase Wallet
										</button>
										<button
											onClick={() => login()}
											className="flex items-center gap-2 w-full text-white bg-gradient-to-tr from-rainbow-dark to-rainbow-light font-semibold rounded-lg p-2.5 transition-colors"
										>
											<img
												alt="Rainbow logo"
												src="/wallets/no-bg/rainbow.svg"
												className="w-5 h-5 mr-0.5 ml-0.5 object-contain rounded-md"
											/>
											Rainbow
										</button>
										<button className="flex items-center gap-2 w-full text-white bg-gradient-to-b from-wallet-connect-light to-wallet-connect-dark font-semibold rounded-lg p-2.5 transition-colors">
											<img
												alt="Wallet connect logo"
												src="/wallets/no-bg/wallet_connect.svg"
												className="w-5 h-5 mr-0.5 ml-0.5 object-contain rounded-md"
											/>
											Wallet Connect
										</button>
									</div>
								</div>
							),
							email: (
								<div className="flex flex-col gap-8">
									<div className="flex flex-col gap-2">
										<p className="text-3xl font-bebas-neue text-white leading-none">
											Enter confirmation code
										</p>
										<p className="text-sm text-grey-200">
											Please check <span className="text-red">{email}</span> for
											an email and enter your code below.
										</p>
									</div>
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
											const confirm = Object.values(emailCode).every(
												(code) => !!code,
											);

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
							),
							// profile: props.user && (
							// 	<div className="flex flex-col gap-6">
							// 		<p className="text-3xl font-bebas-neue text-white leading-none">
							// 			Create Profile
							// 		</p>
							// 		<div className="flex items-center gap-4 h-12">
							// 			<label className="cursor-pointer aspect-square h-full relative group">
							// 				<input
							// 					type="file"
							// 					accept="image/*"
							// 					onChange={async (event) => {
							// 						const files = event.target.files;

							// 						if (files && files.length > 0) {
							// 							const file = files[0];

							// 							// 25 MB in bytes
							// 							if (file.size > 25 * 1024 * 1024) {
							// 								toast.error(
							// 									"Image size should be less than 25 MB",
							// 								);
							// 								return;
							// 							}

							// 							const formData = new FormData();
							// 							formData.append("file", file);

							// 							const hash = await pinImageAction.executeAsync({
							// 								formData,
							// 							});

							// 							if (hash?.data) {
							// 								setImage(
							// 									`https://ipfs.nouns.gg/ipfs/${hash.data}`,
							// 								);
							// 							} else toast.error("Could not upload image");

							// 							event.target.value = "";
							// 						}
							// 					}}
							// 					style={{ display: "none" }}
							// 				/>
							// 				<img
							// 					alt="Update profile logo"
							// 					src={
							// 						image === ""
							// 							? `https://api.cloudnouns.com/v1/pfp?text=${props.user.id}&background=1`
							// 							: image
							// 					}
							// 					className="rounded-full group-hover:opacity-50 transition-opacity"
							// 				/>
							// 				<div className="absolute -bottom-1 -right-1 flex items-center p-1 rounded-full justify-center bg-white text-black">
							// 					<Edit className="w-3 h-3" />
							// 				</div>
							// 			</label>
							// 			<input
							// 				type="text"
							// 				value={name}
							// 				onChange={(e) => setName(e.target.value)}
							// 				placeholder="Enter a display name"
							// 				className="bg-grey-800 rounded-xl text-white placeholder-grey-400 py-2 px-3 outline-none border-grey-600 border-[1px] w-full"
							// 			/>
							// 		</div>
							// 		<div className="flex flex-col gap-4">
							// 			<textarea
							// 				placeholder="Enter a bio"
							// 				value={bio}
							// 				onChange={(e) => setBio(e.target.value)}
							// 				className="bg-grey-800 rounded-xl text-white placeholder-grey-400 py-2 px-3 outline-none custom-scrollbar"
							// 				rows={4}
							// 			/>
							// 		</div>
							// 		{props.user.email ? (
							// 			<div className="flex gap-2">
							// 				<input
							// 					type="checkbox"
							// 					checked={canReceiveEmails}
							// 					onChange={(e) => setCanReceiveEmails(e.target.checked)}
							// 					className="w-4 h-4 accent-red"
							// 				/>
							// 				<p className="text-sm text-white">
							// 					I want to receive promotional emails, rewards, and
							// 					updates from Nouns
							// 				</p>
							// 			</div>
							// 		) : null}
							// 		<button
							// 			onClick={async () => {
							// 				if (!props.user) return;

							// 				const result = await createNexusAction.executeAsync({
							// 					name,
							// 					image:
							// 						image === ""
							// 							? `https://api.cloudnouns.com/v1/pfp?text=${props.user.id}&background=1`
							// 							: image,
							// 					bio,
							// 					canReceiveEmails,
							// 				});

							// 				if (result?.serverError) {
							// 					toast.error(result.serverError);
							// 				}
							// 			}}
							// 			className="flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors"
							// 		>
							// 			{createNexusAction.isPending ? (
							// 				<img
							// 					alt="loading spinner"
							// 					src="/spinner.svg"
							// 					className="h-[18px] animate-spin"
							// 				/>
							// 			) : (
							// 				""
							// 			)}
							// 			Create Profile
							// 		</button>
							// 	</div>
							// ),
						}[section]
					}
				</div>
			</div>
		</Modal>
	);
}
