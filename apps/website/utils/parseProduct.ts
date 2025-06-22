import type { getProduct } from "@/server/queries/shop";

type Product = NonNullable<Awaited<ReturnType<typeof getProduct>>>;

export function parseProduct(props: {
	product: Product;
	preSelectedVariant?: { size?: string; color?: string } | string;
}) {
	const colors: Array<{ id: string; name: string; hex: string }> = [];
	const sizes: Array<string> = [];
	const images: string[] = [];
	const imageIndexFromColor: Record<string, number> = {};

	const variants: Array<
		Product["variants"][number] & {
			color: { id: string } | null;
		}
	> = [];

	for (const variant of props.product.variants) {
		const color = variant.color?.name.toLowerCase().replace(" ", "-");
		const size = variant.size?.toLowerCase();

		variants.push({
			...variant,
			color: variant.color && color ? { id: color, ...variant.color } : null,
		});

		if (variant.color && color && !colors.find((c) => c.id === color)) {
			colors.push({ id: color, ...variant.color });
		}

		if (variant.size && size && !sizes.find((s) => s === size)) {
			sizes.push(size);
		}

		if (variant.images && variant.images.length > 0) {
			images.push(...variant.images);
		}

		if (
			variant.color &&
			color &&
			variant.images &&
			variant.images.length > 0 &&
			imageIndexFromColor[color] === undefined
		) {
			imageIndexFromColor[color] = images.length - variant.images.length;
		}
	}

	return {
		colors,
		sizes,
		images,
		imageIndexFromColor,
		selectedVariant:
			variants.find((v) => {
				if (typeof props.preSelectedVariant === "string") {
					return v.id === props.preSelectedVariant;
				}

				if (props.preSelectedVariant?.size && props.preSelectedVariant?.color) {
					return (
						v.size === props.preSelectedVariant.size &&
						v.color?.id === props.preSelectedVariant.color
					);
				}

				if (props.preSelectedVariant?.color) {
					return v.color?.id === props.preSelectedVariant.color;
				}

				if (props.preSelectedVariant?.size) {
					return v.size === props.preSelectedVariant.size;
				}
			}) ?? variants[0],
	};
}
