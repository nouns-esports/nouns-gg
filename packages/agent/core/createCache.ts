export function createCache() {
	const cache = new Map<string, boolean>();

	setInterval(() => cache.clear(), 1000 * 60 * 60);

	return {
		add: (context: {
			provider: string;
			id: string;
		}) => {
			cache.set(`${context.provider}:${context.id}`, true);
		},
		has: (context: {
			provider: string;
			id: string;
		}) => {
			return cache.has(`${context.provider}:${context.id}`);
		},
	};
}
