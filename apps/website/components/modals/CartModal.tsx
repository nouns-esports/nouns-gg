"use client";

import { LoaderCircle, Trash2, TriangleAlert, X } from "lucide-react";
import { Modal, useModal } from "../Modal";
import { usePathname, useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { removeFromCart } from "@/server/mutations/removeFromCart";
import { addToCart } from "@/server/mutations/addToCard";
import { twMerge } from "tailwind-merge";
import type { AuthenticatedUser } from "@/server/queries/users";
import { checkCart } from "@/server/queries/shop";
import { toast } from "../Toasts";
import { useEffect } from "react";

export default function CartModal(props: {
	user: string;
	cart: NonNullable<AuthenticatedUser["nexus"]>["carts"];
}) {
	const { isOpen, close } = useModal("cart");

	const router = useRouter();

	const subtotal = props.cart.reduce((acc, item) => {
		const variant = item.product.variants.find(
			(variant) => variant.shopifyId === item.variant,
		);

		if (!variant) return acc;

		return acc + Number(variant.price) * item.quantity;
	}, 0);

	const removeFromCartAction = useAction(removeFromCart);
	const addToCartAction = useAction(addToCart);

	const issues = props.cart.some((item) => {
		const variant = item.product.variants.find(
			(variant) => variant.shopifyId === item.variant,
		);

		if (!variant) return false;

		return item.quantity > variant.inventory;
	});

	const pathname = usePathname();

	useEffect(() => {
		if (isOpen && pathname === "/shop/checkout") {
			close();
		}
	}, [isOpen, pathname, close]);

	return (
		<Modal id="cart" className="p-4 flex flex-col max-w-96 w-full gap-6">
			<div className="flex justify-between items-center">
				<p className="text-white text-2xl font-bebas-neue leading-none">
					Your cart
				</p>
				<button
					onClick={close}
					className="p-1 rounded-full bg-grey-600 hover:bg-grey-500 transition-colors"
				>
					<X className="w-4 h-4 text-grey-200" />
				</button>
			</div>
			{props.cart.length > 0 ? (
				<div className="flex flex-col gap-4 max-h-80 max-w-96 overflow-y-auto custom-scrollbar bg-grey-800 rounded-lg p-2">
					{props.cart
						.toSorted((a, b) => a.product.name.localeCompare(b.product.name))
						.map((item) => {
							const variant = item.product.variants.find(
								(variant) => variant.shopifyId === item.variant,
							);

							if (!variant) return;

							return (
								<div key={item.variant} className="flex items-center gap-4">
									<div className="flex items-center gap-2 bg-grey-600 rounded-lg p-2 w-14 h-14 aspect-square">
										<img
											src={`${item.product.images[0]}?img-height=100&img-onerror=redirect`}
											alt={item.product.name}
											className="w-full h-full object-contain"
										/>
									</div>
									<div className="flex flex-col gap-2 w-full">
										<div className="flex items-center justify-between gap-4">
											<p className="text-white line-clamp-1">
												{item.product.name}
											</p>
											{item.quantity <= variant.inventory ? (
												<button
													onClick={async () => {
														await removeFromCartAction.executeAsync({
															product: item.product.id,
															variant: item.variant,
															quantity: item.quantity,
														});

														router.refresh();
													}}
												>
													<Trash2 className="w-4 h-4 text-red hover:text-red/70 transition-colors" />
												</button>
											) : null}
										</div>
										{item.quantity <= variant.inventory ? (
											<div className="flex items-center gap-4">
												<p className="text-white">${variant?.price}</p>
												<div className="flex items-center gap-2">
													<button
														onClick={async () => {
															await removeFromCartAction.executeAsync({
																product: item.product.id,
																variant: item.variant,
																quantity: 1,
															});

															router.refresh();
														}}
														className="w-4 h-4 bg-grey-600 hover:bg-grey-500 transition-colors rounded-full flex items-center justify-center"
													>
														-
													</button>
													<p className="text-white">{item.quantity}</p>
													<button
														disabled={variant.inventory < item.quantity + 1}
														onClick={async () => {
															if (variant.inventory < item.quantity + 1) {
																return;
															}

															await addToCartAction.executeAsync({
																product: item.product.id,
																variant: item.variant,
																quantity: 1,
															});

															router.refresh();
														}}
														className={twMerge(
															"w-4 h-4 bg-grey-600 hover:bg-grey-500 transition-colors rounded-full flex items-center justify-center",
															variant.inventory < item.quantity + 1 &&
																"cursor-not-allowed opacity-50",
														)}
													>
														+
													</button>
												</div>
												<p>{variant.size?.toUpperCase()}</p>
											</div>
										) : (
											<button
												onClick={async () => {
													if (variant.inventory > 0) {
														await removeFromCartAction.executeAsync({
															product: item.product.id,
															variant: item.variant,
															quantity:
																item.quantity -
																(item.quantity - variant.inventory),
														});

														return router.refresh();
													}

													await removeFromCartAction.executeAsync({
														product: item.product.id,
														variant: item.variant,
														quantity: item.quantity,
													});

													router.refresh();
												}}
												className="text-red hover:text-red/70 transition-colors w-min whitespace-nowrap flex items-center gap-1.5"
											>
												<TriangleAlert className="w-4 h-4" />
												{variant.inventory > 0
													? "Update quantity"
													: "Remove from cart"}
											</button>
										)}
									</div>
								</div>
							);
						})}
				</div>
			) : (
				<p>Your cart is empty</p>
			)}
			{props.cart.length > 0 ? (
				<div className="flex justify-between items-center">
					<p className="text-white text-2xl font-bebas-neue leading-none">
						Subtotal
					</p>

					<div className="flex gap-2.5 items-center">
						<p className="text-white text-2xl font-bebas-neue leading-none">
							${Number.isInteger(subtotal) ? subtotal : subtotal.toFixed(2)}
						</p>

						<div className="w-0.5 h-4 bg-grey-500 rounded-full" />
						<div className="flex items-center gap-1.5">
							<img
								src="https://ipfs.nouns.gg/ipfs/bafkreiccw4et522umioskkazcvbdxg2xjjlatkxd4samkjspoosg2wldbu"
								alt="Gold"
								className="w-5 h-5"
							/>
							<p className="text-[#FEBD1C] font-semibold">
								{(subtotal * 100).toLocaleString()}
							</p>
						</div>
					</div>
				</div>
			) : null}
			<div className="flex flex-col gap-2">
				<button
					disabled={
						addToCartAction.isPending ||
						removeFromCartAction.isPending ||
						issues
					}
					onClick={async () => {
						if (
							addToCartAction.isPending ||
							removeFromCartAction.isPending ||
							issues
						) {
							return;
						}

						if (props.cart.length > 0) {
							// Revalidate inventory - if issues reconcile else redirect
							const valid = await checkCart({ user: props.user });

							if (valid) {
								return router.push("/shop/checkout");
							}

							router.refresh();

							toast.error("There was an issue some items in your cart");
						}

						router.push("/shop");
						close();
					}}
					className={twMerge(
						"flex justify-center items-center gap-2 w-full text-black bg-white hover:bg-white/70 font-semibold rounded-lg p-2.5 transition-colors",
						(addToCartAction.isPending ||
							removeFromCartAction.isPending ||
							issues) &&
							"pointer-events-none opacity-50",
					)}
				>
					{addToCartAction.isPending || removeFromCartAction.isPending ? (
						<img
							alt="Loading spinner"
							src="/spinner.svg"
							className="h-[18px] animate-spin"
						/>
					) : null}
					{props.cart.length > 0 ? "Checkout" : "Visit Shop"}
				</button>
				{issues ? (
					<small className="text-red text-sm w-full text-center">
						Inventory has changed with some items in your cart
					</small>
				) : null}
			</div>
		</Modal>
	);
}
