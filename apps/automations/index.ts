import { privySync } from "./jobs/privySync";
import { refreshLeaderboard } from "./jobs/refreshLeaderboard";
import { refreshRoles } from "./jobs/refreshRoles";
import { shopifySync } from "./jobs/shopifySync";

const jobs = [privySync, refreshLeaderboard, refreshRoles, shopifySync];

for (const job of jobs) {
	job.start();
}
