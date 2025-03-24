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
		if (value.startsWith("0x")) {
			return Buffer.from(value.slice(2), "hex");
		}

		return Buffer.from(value);
	},
	fromDriver(value: Buffer): string {
		return "0x" + value.toString("hex");
	},
});
