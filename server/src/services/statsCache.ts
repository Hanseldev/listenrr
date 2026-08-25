import { prisma } from "../lib/prisma.js";
import { getValidAccessToken } from "./spotifyAuth.js";
import {
	getTotalPlaysThisMonth,
	getHoursListened,
	getListeningTrend,
	getLongestStreak,
} from "./stats.js";
import { getAverageReleaseYearOfLikedTracks } from "./likedSongs.js";

export async function computeAndCacheStats(userId: string) {
	try {
		const totalPlaysThisMonth = await getTotalPlaysThisMonth(userId);
		const hoursListened = await getHoursListened(userId);
		const listeningTrend = await getListeningTrend(userId);
		const longestStreak = await getLongestStreak(userId);

		const accessToken = await getValidAccessToken(userId);
		const avgReleaseYear =
			await getAverageReleaseYearOfLikedTracks(accessToken);

		await prisma.statsCache.upsert({
			where: { userId },
			update: {
				totalPlaysThisMonth,
				hoursListened,
				listeningTrend,
				avgReleaseYear,
				longestStreak,
				computedAt: new Date(),
			},
			create: {
				userId,
				totalPlaysThisMonth,
				hoursListened,
				listeningTrend,
				avgReleaseYear,
				longestStreak,
			},
		});
	} catch (err) {
		console.error(`Failed to compute/cache stats for user ${userId}:`, err);
	}
}
