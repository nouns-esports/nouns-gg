"use client";

import { addToCart } from "@/server/mutations/addToCard";
import Button from "./Button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "./Toasts";
import { useRouter } from "next/navigation";

export default function AddToCartButton(props: {
	image: string;
	name: string;
	product: number;
	variant: string;
	inventory: number;
}) {
	const addToCartAction = useAction(addToCart);

	const router = useRouter();

	return (
		<Button
			onClick={async () => {
				await addToCartAction.executeAsync({
					product: props.product,
					variant: props.variant,
					quantity: 1,
				});

				toast.custom({
					image: props.image,
					title: props.name,
					description: "Added to cart",
					objectFit: "contain",
				});

				router.refresh();
			}}
			loading={addToCartAction.isPending}
			disabled={addToCartAction.isPending || props.inventory < 1}
		>
			{props.inventory < 1 ? "Out of Stock" : "Add to Cart"}
		</Button>
	);
}
