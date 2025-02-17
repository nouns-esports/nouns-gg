import { schedule, validate } from "node-cron";

export function createJob(config: {
	name: string;
	cron: string;
	execute: () => Promise<void>;
}) {
	if (!validate(config.cron)) {
		throw new Error("Invalid cron expression");
	}

	schedule(
		config.cron,
		async () => {
			try {
				console.log(`Running job ${config.name}`);
				await config.execute();
				console.log(`Job ${config.name} completed`);
			} catch (e) {
				console.error(`Failed to run job ${config.name}`, e);
			}
		},
		{ timezone: "America/Chicago" },
	);
}
