import { prisma } from "../lib/prisma.js";
import { getValidAccessToken } from "./spotifyAuth.js";
import {
	getTotalPlaysThisMonth,
	getHoursListened,
	getListeningTrend,
	getLongestStreak,
	getCurrentStreak,
	getAverageTrackDuration,
} from "./stats.js";
import { getAverageReleaseYearOfLikedTracks } from "./likedSongs.js";

export async function computeAndCacheStats(userId: string) {
	try {
		const totalPlaysThisMonth = await getTotalPlaysThisMonth(userId);
		const hoursListened = await getHoursListened(userId);
		const listeningTrend = await getListeningTrend(userId);
		const longestStreak = await getLongestStreak(userId);
		const currentStreak = await getCurrentStreak(userId);
		const averageTrackDuration = await getAverageTrackDuration(userId);
		console.log(`[DEBUG] averageTrackDuration for ${userId}:`, averageTrackDuration);

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

		console.log(`[DEBUG] About to upsert avgTrackDuration:`, averageTrackDuration);

		await prisma.statsCache.upsert({
			where: { userId },
			update: {
				totalPlaysThisMonth,
				hoursListened,
				listeningTrend,
				avgReleaseYear: avgReleaseYear ?? existing?.avgReleaseYear ?? 0,
				longestStreak,
				currentStreak,
				avgTrackDuration: averageTrackDuration,
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
				avgTrackDuration: averageTrackDuration,
			},
		});
	} catch (err) {
		console.error(`Failed to compute/cache stats for user ${userId}:`, err);
	}
}
