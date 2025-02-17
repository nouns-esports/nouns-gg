"use client";

export default function DateComponent(props: {
	timestamp?: string | Date | number;
	short?: boolean;
}) {
	const now = new Date();
	const date = new Date(props.timestamp ?? now);

	const day = date.getDate();

	let ordinal = "";

	if (day > 3 && day < 21) ordinal = "th";
	else {
		switch (day % 10) {
			case 1:
				ordinal = "st";
				break;
			case 2:
				ordinal = "nd";
				break;
			case 3:
				ordinal = "rd";
				break;
			default:
				ordinal = "th";
		}
	}

	if (date <= now) {
		if (props.short) {
			return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
		}

		return date.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	}

	if (props.short) {
		return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
	}

	return `${date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
	})}${ordinal}, ${date
		.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		})
		.replace(":00 ", "")
		.toLowerCase()} `;
}

export function Month(props: { timestamp: string | Date | number }) {
	const date = new Date(props.timestamp);
	return date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
	});
}

export function Hour(props: { timestamp: string | Date | number }) {
	const date = new Date(props.timestamp);
	return date
		.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		})
		.toLowerCase();
}
