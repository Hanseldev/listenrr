import { prisma } from "../lib/prisma.js";
import { getArtistImage } from "./artistImage.js";
import axios from "axios";
import { spotifyRequestWithRetry } from "./rateLimitResolver.js";

export async function getTotalPlaysThisMonth(userId: string) {
	const now = new Date();
	const startOfCurrentMonth = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
	);

	return prisma.play.count({
		where: {
			userId: userId,
			playedAt: {
				gte: startOfCurrentMonth,
			},
		},
	});
}

export async function getHoursListened(userId: string) {
	const now = new Date();
	const startOfLastMonth = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
	);
	const startOfCurrentMonth = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
	);

	const lastMonthHoursListened = await prisma.play.aggregate({
		where: {
			userId: userId,
			playedAt: {
				gte: startOfLastMonth,
				lt: startOfCurrentMonth,
			},
		},
		_sum: {
			durationMs: true,
		},
	});
	const currentMonthHoursListened = await prisma.play.aggregate({
		where: {
			userId: userId,
			playedAt: {
				gte: startOfCurrentMonth,
			},
		},
		_sum: {
			durationMs: true,
		},
	});

	return {
		lastMonthHoursListened: (
			(lastMonthHoursListened._sum.durationMs ?? 0) /
			1000 /
			60 /
			60
		).toFixed(1),
		currentMonthHoursListened: (
			(currentMonthHoursListened._sum.durationMs ?? 0) /
			1000 /
			60 /
			60
		).toFixed(1),
	};
}

export async function getTopTracks(userId: string, limit: number = 100) {
	const result = await prisma.play.groupBy({
		by: ["trackId", "trackName", "artistNames", "albumArtUrl"],
		where: { userId },
		_count: {
			trackId: true,
		},
		orderBy: {
			_count: {
				trackId: "desc",
			},
		},
		take: limit,
	});

	return result;
}

export async function getTopArtists(userId: string, limit: number = 100) {
	const plays = await prisma.play.findMany({
		where: { userId },
		select: {
			artistNames: true,
		},
	});

	const artistCounts = new Map<string, number>();

	for (const play of plays) {
		const artists = play.artistNames.split(", ");
		for (const artist of artists) {
			artistCounts.set(artist, (artistCounts.get(artist) ?? 0) + 1);
		}
	}

	const sorted = Array.from(artistCounts.entries())
		.map(([artistName, playCount]) => ({ artistName, playCount }))
		.sort((a, b) => b.playCount - a.playCount)
		.slice(0, limit);

	const withImages = [];
	for (const artist of sorted) {
		const imageUrl = await getArtistImage(userId, artist.artistName);
		withImages.push({ ...artist, imageUrl });
	}

	return withImages;
}

// AI generated code

export async function getLongestStreak(userId: string) {
	const plays = await prisma.play.findMany({
		where: { userId },
		select: { playedAt: true },
	});

	// Step 1-3: get distinct day-strings
	const dayStrings = new Set(
		plays.map((play) => play.playedAt.toISOString().slice(0, 10)),
	);

	// Step 4: sort them chronologically
	const sortedDays = Array.from(dayStrings).sort();

	if (sortedDays.length === 0) return 0;

	// Step 5: walk through, tracking streaks
	let longestStreak = 1;
	let currentStreak = 1;

	for (let i = 1; i < sortedDays.length; i++) {
		const prevDay = sortedDays[i - 1];
		const currDay = sortedDays[i];

		if (!prevDay || !currDay) continue; // satisfies TS, effectively unreachable given the loop bounds

		const prevDate = new Date(prevDay);
		const currDate = new Date(currDay);

		const dayDiff =
			(currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

		if (dayDiff === 1) {
			currentStreak++;
			longestStreak = Math.max(longestStreak, currentStreak);
		} else {
			currentStreak = 1;
		}
	}

	return longestStreak;
}

// Still AI generated
export async function getListeningTrend(userId: string) {
	const DAYS = 28;
	const now = new Date();
	const start = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate() - (DAYS - 1),
		),
	);

	const plays = await prisma.play.findMany({
		where: {
			userId,
			playedAt: {
				gte: start,
			},
		},
		select: {
			playedAt: true,
			durationMs: true,
		},
	});

	const buckets = new Array(DAYS).fill(0);

	for (const play of plays) {
		const dayIndex = Math.floor(
			(play.playedAt.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
		);
		if (dayIndex >= 0 && dayIndex < DAYS) {
			buckets[dayIndex] += play.durationMs;
		}
	}

	return buckets.map((totalMs, index) => {
		const hours = Number((totalMs / 1000 / 60 / 60).toFixed(1));

		return {
			value: hours,
		};
	});
}

export async function getSpotifyTopTracks(
	accessToken: string,
	timeRange: "short_term" | "medium_term" | "long_term",
	limit: number,
) {
	const response = await spotifyRequestWithRetry(() =>
		axios.get("https://api.spotify.com/v1/me/top/tracks", {
			headers: { Authorization: `Bearer ${accessToken}` },
			params: {
				time_range: timeRange,
				limit,
			},
		}),
	);
	return response.data.items.map((item: any) => ({
		trackId: item.id,
		trackName: item.name,
		artistNames: item.artists.map((a: any) => a.name).join(", "),
		albumArtUrl: item.album?.images?.[0]?.url ?? null,
	}));
}

export async function getSpotifyTopArtists(
	accessToken: string,
	timeRange: "short_term" | "medium_term" | "long_term",
	limit: number,
) {
	const response = await spotifyRequestWithRetry(() =>
		axios.get("https://api.spotify.com/v1/me/top/artists", {
			headers: { Authorization: `Bearer ${accessToken}` },
			params: { time_range: timeRange, limit },
		}),
	);

	return response.data.items.map((item: any) => ({
		artistName: item.name,
		imageUrl: item.images?.[0]?.url ?? null,
	}));
}

export async function getCurrentStreak(userId: string) {
	const plays = await prisma.play.findMany({
		where: { userId },
		select: { playedAt: true },
	});

	if (plays.length === 0) return 0;

	const playedDays = new Set(
		plays.map((p) => p.playedAt.toISOString().slice(0, 10)),
	);

	const today = new Date();
	today.setUTCHours(0, 0, 0, 0);

	// If today has no plays, start checking from yesterday instead —
	// a day still "in progress" shouldn't break an ongoing streak.
	const todayStr = today.toISOString().slice(0, 10);
	if (!playedDays.has(todayStr)) {
		today.setUTCDate(today.getUTCDate() - 1);
	}

	let streak = 0;
	const cursor = new Date(today);

	while (playedDays.has(cursor.toISOString().slice(0, 10))) {
		streak++;
		cursor.setUTCDate(cursor.getUTCDate() - 1);
	}

	return streak;
}

export async function getAverageTrackDuration(userId: string) {
	const result = await prisma.play.aggregate({
		where: { userId },
		_avg: { durationMs: true },
	});

	const avgMs = result._avg.durationMs ?? 0;
	const totalSeconds = Math.round(avgMs / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
