"use client";

export default function DateComponent(props: {
	timestamp?: string | Date | number;
	format: string;
}) {
	const date = new Date(props.timestamp ?? new Date());

	const hour = date.getHours() % 12 || 12; // Convert to 12-hour format
	const minute = date.getMinutes();
	const second = date.getSeconds();
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const monthShort = date.toLocaleDateString("en-US", { month: "short" });
	const monthLong = date.toLocaleDateString("en-US", { month: "long" });
	const year = date.getFullYear();
	const meridiem = date.getHours() >= 12 ? "pm" : "am";

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

	// Replace all tokens in the format string
	return props.format
		.replace(/%day/g, day.toString())
		.replace(/%monthLong/g, monthLong)
		.replace(/%monthShort/g, monthShort)
		.replace(/%month/g, month.toString())
		.replace(/%year/g, year.toString())
		.replace(/%ordinal/g, ordinal)
		.replace(/%hour/g, hour.toString())
		.replace(/%minute/g, minute.toString().padStart(2, "0"))
		.replace(/%second/g, second.toString().padStart(2, "0"))
		.replace(/%meridiem/g, meridiem);
}
