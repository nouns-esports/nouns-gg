"use client";

import { Modal, useModal } from "../Modal";
import Button from "../Button";
import { useState } from "react";
import { toast } from "../Toasts";
import { pinImage } from "@/server/mutations/pinImage";
import { useAction } from "next-safe-action/hooks";
import { updateNexus } from "@/server/mutations/updateNexus";
import {
	ArrowRight,
	Edit,
	LinkIcon,
	UserPen,
	X,
	XIcon,
	Mail,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useLinkAccount, useLogin, usePrivy } from "@privy-io/react-auth";
import type { AuthenticatedUser } from "@/server/queries/users";
import Tabs from "../Tabs";
import { deleteUser } from "@/server/mutations/deleteUser";
import { usePrivyModalState } from "@/providers/Privy";
import { env } from "~/env";
import Link from "@/components/Link";
import { EnvelopeSimple } from "phosphor-react-sc";
import { useRouter } from "next/navigation";
export default function SettingsModal(props: { user: AuthenticatedUser }) {
	const [tab, setTab] = useState<
		string | "profile" | "connections" | "advanced"
	>("profile");

	const [image, setImage] = useState(props.user.nexus?.image);
	const [name, setName] = useState(props.user.nexus?.name);
	const [bio, setBio] = useState(props.user.nexus?.bio);
	const [canRecieveEmails, setCanReceiveEmails] = useState(
		props.user.nexus?.canRecieveEmails ?? false,
	);

	const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

	const pinImageAction = useAction(pinImage);
	const router = useRouter();

	const {
		unlinkFarcaster,
		unlinkWallet,
		unlinkTwitter,
		unlinkEmail,
		unlinkDiscord,
		logout,
	} = usePrivy();

	const { linkWallet, linkFarcaster, linkTwitter, linkDiscord, linkEmail } =
		useLinkAccount({
			onSuccess: ({ linkMethod }) => {
				toast.success(`Linked ${linkMethod}`);
				router.refresh();
			},
			onError: (_, { linkMethod }) => {
				toast.error(`Issue linking ${linkMethod}`);
			},
		});

	const { setPrivyModalState } = usePrivyModalState();

	const { isOpen, close } = useModal("settings");

	const updateNexusAction = useAction(updateNexus, {
		onSuccess: () => {
			toast.success("Profile updated");
			close();
		},
		onError: ({ error }) => {
			toast.error(error.serverError ?? "Could not update profile");
		},
	});

	const deleteUserAction = useAction(deleteUser, {
		onSuccess: () => {
			toast.success("Account deleted");
			close();
			window.location.href = "/";
		},
		onError: ({ error }) => {
			toast.error(
				error.serverError ??
					"Could not delete account, reach out in the Discord server for help.",
			);
		},
	});

	console.log(props.user.wallets.map((wallet) => wallet.walletClientType));

	return (
		<Modal
			id="settings"
			className="p-4 flex flex-col w-full max-w-96 min-h-[500px] gap-4"
		>
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Settings
				</p>
				<button
					onClick={close}
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</button>
			</div>
			<Tabs
				selected={tab}
				onSelectionChange={(value) => setTab(value)}
				options={{
					profile: "Profile",
					connections: "Connections",
					advanced: "Advanced",
				}}
			/>
			<div className="flex flex-col flex-1 gap-4 w-full">
				{
					{
						profile: (
							<div className="flex flex-col justify-between flex-1 gap-4">
								<div className="flex flex-col gap-4">
									<div className="flex items-center gap-4 h-12">
										<label className="cursor-pointer aspect-square h-full relative group">
											<input
												type="file"
												accept="image/*"
												onChange={async (event) => {
													const files = event.target.files;

													if (files && files.length > 0) {
														const file = files[0];

														// 25 MB in bytes
														if (file.size > 25 * 1024 * 1024) {
															toast.error(
																"Image size should be less than 25 MB",
															);
															return;
														}

														const formData = new FormData();
														formData.append("file", file);

														const hash = await pinImageAction.executeAsync({
															formData,
														});

														if (hash?.data) {
															setImage(
																`https://ipfs.nouns.gg/ipfs/${hash.data}`,
															);
														} else toast.error("Could not upload image");

														event.target.value = "";
													}
												}}
												style={{ display: "none" }}
											/>
											<img
												alt="Edit profile logo"
												src={
													image === ""
														? `https://api.cloudnouns.com/v1/pfp?text=${props.user.id}&background=1`
														: image
												}
												className="rounded-full group-hover:opacity-50 transition-opacity"
											/>
											<div className="absolute -bottom-1 -right-1 flex items-center p-1 rounded-full justify-center bg-white text-black">
												<Edit className="w-3 h-3" />
											</div>
										</label>
										<input
											type="text"
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="Enter a display name"
											className="bg-grey-800 rounded-xl text-white placeholder-grey-400 py-2 px-3 outline-none border-grey-600 border-[1px] w-full"
										/>
									</div>
									<div className="flex flex-col gap-4">
										<textarea
											placeholder="Enter a bio"
											value={bio ?? ""}
											onChange={(e) => setBio(e.target.value)}
											className="bg-grey-800 rounded-xl text-white placeholder-grey-400 py-2 px-3 outline-none custom-scrollbar"
											rows={4}
										/>
									</div>
									{props.user.email ? (
										<div className="flex gap-2">
											<input
												type="checkbox"
												checked={canRecieveEmails}
												onChange={(e) => setCanReceiveEmails(e.target.checked)}
												className="w-4 h-4 accent-red"
											/>
											<p className="text-sm text-white">
												I want to receive promotional emails, rewards, and
												updates from Nouns
											</p>
										</div>
									) : null}
									<div className="flex items-center justify-between gap-4">
										<button
											onClick={() =>
												updateNexusAction.execute({
													name: name ?? undefined,
													bio: bio ?? undefined,
													image,
													canRecieveEmails,
												})
											}
											className="flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors"
										>
											{updateNexusAction.isPending ? (
												<img
													alt="loading spinner"
													src="/spinner.svg"
													className="h-[18px] animate-spin"
												/>
											) : (
												""
											)}
											Update
											<UserPen className="w-4 h-4" />
										</button>
									</div>
								</div>

								<button
									onClick={async () => {
										await logout();
										close();
										window.location.href = "/";
									}}
									className="flex items-center gap-1 text-red group hover:text-red/70 transition-colors"
								>
									Sign out
									<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</button>
							</div>
						),
						connections: (
							<div className="flex flex-col gap-3 w-full">
								<div className="flex gap-2 justify-between items-center w-full">
									<div className="flex items-center gap-3 w-full">
										<div className="flex items-center justify-center bg-pink h-10 w-10 rounded-md flex-shrink-0">
											<EnvelopeSimple
												className="w-6 h-6 text-white"
												weight="fill"
											/>
										</div>
										<div className="flex flex-col w-full">
											<p className="text-white font-semibold">Email</p>
											<p
												className={twMerge(
													props.user.email?.address ? "text-green" : "text-red",
													"max-w-[150px] truncate",
												)}
											>
												{props.user.email?.address ?? "Not Connected"}
											</p>
										</div>
									</div>
									<Button
										onClick={async () => {
											if (props.user.email?.address) {
												await unlinkEmail(props.user.email.address);
												router.refresh();
												toast.success("Email disconnected");
											} else linkEmail();
										}}
										size="sm"
									>
										{props.user.email?.address ? "Remove" : "Add"}
									</Button>
								</div>
								<div className="flex gap-2 justify-between items-center">
									<div className="flex items-center gap-3">
										<img
											alt="Discord logo"
											src="https://ipfs.nouns.gg/ipfs/QmPxubNKVTpAakwU9M9gLVhiqN7qaafabxbYH4jHKoG6aU"
											className="h-10 w-10 rounded-md"
										/>
										<div className="flex flex-col">
											<p className="text-white font-semibold">Discord</p>
											<p
												className={twMerge(
													props.user.discord ? "text-green" : "text-red",
												)}
											>
												{props.user.discord ? "Connected" : "Not Connected"}
											</p>
										</div>
									</div>
									<Button
										onClick={async () => {
											if (props.user.discord) {
												await unlinkDiscord(props.user.discord.subject);
												router.refresh();
												toast.success("Discord disconnected");
											} else linkDiscord();
										}}
										size="sm"
									>
										{props.user.discord ? "Remove" : "Add"}
									</Button>
								</div>
								<div className="flex gap-2 justify-between items-center">
									<div className="flex items-center gap-3">
										<img
											alt="Warpcast logo"
											src="https://ipfs.nouns.gg/ipfs/Qmcqq8J9wXCDTTbVmB8n5xSdGQ3Kna2K6dnTXriNs7MeHc"
											className="h-10 w-10 rounded-md"
										/>
										<div className="flex flex-col">
											<p className="text-white font-semibold">Warpcast</p>
											<p
												className={twMerge(
													props.user.farcaster ? "text-green" : "text-red",
												)}
											>
												{props.user.farcaster ? "Connected" : "Not Connected"}
											</p>
										</div>
									</div>
									<Button
										onClick={async () => {
											if (props.user.farcaster) {
												await unlinkFarcaster(props.user.farcaster.fid);
												router.refresh();
												toast.success("Farcaster disconnected");
											} else linkFarcaster();
										}}
										size="sm"
									>
										{props.user.farcaster ? "Remove" : "Add"}
									</Button>
								</div>
								<div className="flex gap-2 justify-between items-center">
									<div className="flex items-center gap-3">
										<img
											alt="Twitter logo"
											src="https://ipfs.nouns.gg/ipfs/QmUdf8usCZDwv8dkmqyc2maVwitevAHtKXGbTnUx8dEaz7"
											className="h-10 w-10 rounded-md"
										/>
										<div className="flex flex-col">
											<p className="text-white font-semibold">Twitter</p>
											<p
												className={twMerge(
													props.user.twitter ? "text-green" : "text-red",
												)}
											>
												{props.user.twitter ? "Connected" : "Not Connected"}
											</p>
										</div>
									</div>
									<Button
										onClick={async () => {
											if (props.user.twitter) {
												await unlinkTwitter(props.user.twitter.subject);
												router.refresh();
												toast.success("Twitter disconnected");
											} else linkTwitter();
										}}
										size="sm"
									>
										{props.user.twitter ? "Remove" : "Add"}
									</Button>
								</div>
								{/* {props.user.smartWallet ? (
									<div className="flex gap-2 justify-between items-center">
										<div className="flex items-center gap-3">
											<img
												alt="Nouns logo"
												src="/logo/logo-square.svg"
												className="h-10 w-10 rounded-md"
											/>
											<div className="flex flex-col">
												<p className="text-white font-semibold">Wallet</p>
												<p className="text-blue-500">
													{props.user.smartWallet.substring(0, 6)}...
													{props.user.smartWallet.substring(
														props.user.smartWallet.length - 4,
													)}
												</p>
											</div>
										</div>
										<Button
											href={`https://${env.NEXT_PUBLIC_ENVIRONMENT === "development" ? "sepolia." : ""}basescan.org/address/${props.user.smartWallet}`}
											size="sm"
											newTab
										>
											View
										</Button>
									</div>
								) : null} */}
								<div className="flex flex-col gap-3">
									<div className="flex items-center justify-between">
										<p className="text-white font-semibold">External Wallets</p>
										<button
											onClick={() => linkWallet()}
											className="flex items-center gap-1 text-red hover:text-red/70 transition-colors"
										>
											<LinkIcon className="w-4 h-4" />
											Add
										</button>
									</div>
									<div className="flex flex-col gap-2">
										{props.user.wallets
											.filter((wallet) => wallet.walletClientType !== "privy")
											.map((wallet) => (
												<div
													key={wallet.address}
													className="flex items-center gap-2 justify-between"
												>
													<Link
														href={`https://${env.NEXT_PUBLIC_ENVIRONMENT === "development" ? "sepolia." : ""}basescan.org/address/${wallet.address}`}
														newTab
														className="flex items-center gap-2 group"
													>
														<img
															alt={wallet.walletClientType}
															src={
																{
																	rainbow:
																		"https://ipfs.nouns.gg/ipfs/QmbsJ82EZw2oJtdPbiNdfQ8LPW2P8JxMHbWvqrj9ZWwNF9",
																	coinbase_wallet:
																		"https://ipfs.nouns.gg/ipfs/QmdSdo9pCPr3MpBRKAySnjwRfEH4tCm9aHggzqVgsPY2fx",
																	metamask:
																		"https://ipfs.nouns.gg/ipfs/QmdF9f6t9EFHAXF35wmmEN2LPCdtojZKqJteKYmnHsa14G",
																}[wallet.walletClientType ?? ""] ??
																"https://ipfs.nouns.gg/ipfs/QmXiGnEvjtEHTsYxGEiQo8pENMZJHWxywDkEvrQ1xMJpf8"
															}
															className="h-6 w-6 rounded-md"
														/>
														<p className="text-white group-hover:text-white/70 transition-colors">
															{wallet.address.substring(0, 6)}...
															{wallet.address.substring(
																wallet.address.length - 4,
															)}
														</p>
													</Link>
													<button
														onClick={async () => {
															await unlinkWallet(wallet.address);
															router.refresh();
															toast.success("Wallet disconnected");
														}}
														className="hover:text-white/70 text-white transition-colors"
													>
														<XIcon className="w-5 h-5 " />
													</button>
												</div>
											))}
										{props.user.wallets.length === 0
											? "No external wallets verified"
											: null}
									</div>
								</div>
							</div>
						),
						advanced: (
							<>
								<div className="flex gap-2 justify-between items-center">
									<div className="flex flex-col gap-1">
										<p className="text-white font-semibold">Delete Account</p>
										<div className="flex gap-2">
											<input
												checked={confirmDeleteAccount}
												onChange={(e) =>
													setConfirmDeleteAccount(!confirmDeleteAccount)
												}
												type="checkbox"
												className="accent-red w-3"
											/>
											<p className="text-red text-sm">Are you sure?</p>
										</div>
									</div>
									<Button
										disabled={!confirmDeleteAccount}
										onClick={() => {
											if (!confirmDeleteAccount) return;
											deleteUserAction.execute();
										}}
										size="sm"
									>
										Delete Account
									</Button>
								</div>
							</>
						),
					}[tab]
				}
			</div>
		</Modal>
	);
}
