import { previousFriday, nextFriday } from "date-fns";

export function leaderboardTimestamps() {
	const now = new Date();

	return {
		previous: new Date(previousFriday(now).setHours(13, 30, 0, 0)),
		current: new Date(nextFriday(now).setHours(13, 30, 0, 0)),
	};
}
