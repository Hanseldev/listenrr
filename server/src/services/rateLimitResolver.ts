export async function spotifyRequestWithRetry<T>(
	fn: () => Promise<T>,
	retries = 1,
): Promise<T> {
	try {
		return await fn();
	} catch (err: any) {
		if (err.response?.status === 429 && retries > 0) {
			const retryAfter = Number(err.response.headers["retry-after"]) || 5;

			if (retryAfter > 60) {
				console.warn(
					`Rate limited for ${retryAfter}s — too long to wait, skipping until next cron cycle`,
				);
				throw err;
			}

			console.warn(`Rate limited, waiting ${retryAfter}s before retry`);
			await new Promise((r) => setTimeout(r, retryAfter * 1000));
			return spotifyRequestWithRetry(fn, retries - 1);
		}
		throw err;
	}
}
