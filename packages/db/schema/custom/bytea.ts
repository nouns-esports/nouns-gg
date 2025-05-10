import { customType } from "drizzle-orm/pg-core";
import { Buffer } from "buffer";

export const bytea = customType<{
	data: string;
	driverData: Buffer;
}>({
	dataType() {
		return "bytea";
	},
	toDriver(value: string): Buffer {
		console.log("value", value);
		if (value.startsWith("0x")) {
			return Buffer.from(value.slice(2), "hex");
		}

		return Buffer.from(value);
	},
	fromDriver(value: Buffer | string): string {
		if (typeof value === "string") {
			return value.replace("\\x", "0x");
		}

		return "0x" + value.toString("hex");
	},
});

export const byteaArray = customType<{
	data: string[];
	driverData: Buffer[];
}>({
	dataType() {
		return "bytea[]";
	},
	toDriver(values: string[]): Buffer[] {
		return values.map((value) => {
			if (value.startsWith("0x")) {
				return Buffer.from(value.slice(2), "hex");
			}
			return Buffer.from(value);
		});
	},
	fromDriver(value: Buffer[] | string): string[] {
		if (typeof value === "string") {
			// e.g. "{\x01\x02,\x03\x04}" → ["0x0102","0x0304"]
			const items = value.slice(1, -1).split(",");
			return items.map((item) => {
				const hex = item.replace(/\\x/g, "");
				return "0x" + hex;
			});
		}
		return value.map((buf) => "0x" + buf.toString("hex"));
	},
});
