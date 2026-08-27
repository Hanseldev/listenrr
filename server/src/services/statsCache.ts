import { prisma } from "../lib/prisma.js";
import { getValidAccessToken } from "./spotifyAuth.js";
import {
	getTotalPlaysThisMonth,
	getHoursListened,
	getListeningTrend,
	getLongestStreak,
	getCurrentStreak
} from "./stats.js";
import { getAverageReleaseYearOfLikedTracks } from "./likedSongs.js";

export async function computeAndCacheStats(userId: string) {
	try {
		const totalPlaysThisMonth = await getTotalPlaysThisMonth(userId);
		const hoursListened = await getHoursListened(userId);
		const listeningTrend = await getListeningTrend(userId);
		const longestStreak = await getLongestStreak(userId);
		const currentStreak = await getCurrentStreak(userId);

		let avgReleaseYear: number | null = null;
		try {
			const accessToken = await getValidAccessToken(userId);
			avgReleaseYear = await getAverageReleaseYearOfLikedTracks(accessToken);
		} catch (err) {
			console.error(
				`Skipping avgReleaseYear for user ${userId} (Spotify call failed):`,
				err instanceof Error ? err.message : err,
			);
		}

		const existing = await prisma.statsCache.findUnique({ where: { userId } });

		await prisma.statsCache.upsert({
			where: { userId },
			update: {
				totalPlaysThisMonth,
				hoursListened,
				listeningTrend,
				avgReleaseYear: avgReleaseYear ?? existing?.avgReleaseYear ?? 0,
				longestStreak,
				currentStreak,
				computedAt: new Date(),
			},
			create: {
				userId,
				totalPlaysThisMonth,
				hoursListened,
				listeningTrend,
				avgReleaseYear: avgReleaseYear ?? 0,
				longestStreak,
				currentStreak,
			},
		});
	} catch (err) {
		console.error(`Failed to compute/cache stats for user ${userId}:`, err);
	}
}