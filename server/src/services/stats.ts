import { prisma } from "../lib/prisma.js";
import { getArtistImage } from "./artistImage.js";
import axios from "axios";
import { getValidAccessToken } from "./spotifyAuth.js";
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
		popularity: item.popularity,
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
		popularity: item.popularity,
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

export async function getRecentlyPlayed(userId: string, limit: number = 20) {
	return prisma.play.findMany({
		where: { userId },
		orderBy: { playedAt: "desc" },
		take: limit,
		select: {
			trackId: true,
			trackName: true,
			artistNames: true,
			albumArtUrl: true,
			playedAt: true,
		},
	});
}

export async function getCurrentlyPlaying(userId: string) {
	const accessToken = await getValidAccessToken(userId);

	try {
		const response = await spotifyRequestWithRetry(() =>
			axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
				headers: { Authorization: `Bearer ${accessToken}` },
			}),
		);

		if (!response.data || !response.data.item) {
			return null;
		}

		const item = response.data.item;
		return {
			trackName: item.name,
			artistNames: item.artists.map((a: any) => a.name).join(", "),
			albumArtUrl: item.album?.images?.[0]?.url ?? null,
			isPlaying: response.data.is_playing,
			progressMs: response.data.progress_ms,
			durationMs: item.duration_ms,
		};
	} catch (err: any) {
		if (err.response?.status === 204) return null; // nothing playing
		throw err;
	}
}

export async function getTopAlbums(userId: string, limit: number = 100) {
	const result = await prisma.play.groupBy({
		by: ["albumName", "albumArtUrl"],
		where: { userId },
		_count: { albumName: true },
		orderBy: { _count: { albumName: "desc" } },
		take: limit,
	});
	return result;
}

export async function getSpotifyTopAlbums(
	accessToken: string,
	timeRange: "short_term" | "medium_term" | "long_term",
	limit: number,
) {
	const response = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
		headers: { Authorization: `Bearer ${accessToken}` },
		params: { time_range: timeRange, limit: 50 },
	});

	const albumMap = new Map<
		string,
		{ albumName: string; albumArtUrl: string | null; count: number }
	>();

	for (const track of response.data.items) {
		const albumId = track.album.id;
		const existing = albumMap.get(albumId);
		if (existing) {
			existing.count++;
		} else {
			albumMap.set(albumId, {
				albumName: track.album.name,
				albumArtUrl: track.album.images?.[0]?.url ?? null,
				count: 1,
			});
		}
	}

	return Array.from(albumMap.values())
		.sort((a, b) => b.count - a.count)
		.slice(0, limit);
}

export async function getGenreBreakdown(
	accessToken: string,
	timeRange: "short_term" | "medium_term" | "long_term",
) {
	const artistsResponse = await spotifyRequestWithRetry(() =>
		axios.get("https://api.spotify.com/v1/me/top/artists", {
			headers: { Authorization: `Bearer ${accessToken}` },
			params: { time_range: timeRange, limit: 50 },
		}),
	);

	const artistIds: string[] = artistsResponse.data.items.map((a: any) => a.id);

	if (artistIds.length === 0) return [];

	// Spotify allows batch lookup of up to 50 artist IDs in one call
	const detailsResponse = await spotifyRequestWithRetry(() =>
		axios.get("https://api.spotify.com/v1/artists", {
			headers: { Authorization: `Bearer ${accessToken}` },
			params: { ids: artistIds.join(",") },
		}),
	);

	const genreCounts = new Map<string, number>();

	for (const artist of detailsResponse.data.artists) {
		for (const genre of artist.genres) {
			genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
		}
	}

	const total = Array.from(genreCounts.values()).reduce((a, b) => a + b, 0);

	return Array.from(genreCounts.entries())
		.map(([genre, count]) => ({
			genre,
			count,
			percentage: Number(((count / total) * 100).toFixed(1)),
		}))
		.sort((a, b) => b.count - a.count);
}

export async function getAverageObscurity(
	accessToken: string,
	timeRange: "short_term" | "medium_term" | "long_term",
) {
	const response = await spotifyRequestWithRetry(() =>
		axios.get("https://api.spotify.com/v1/me/top/tracks", {
			headers: { Authorization: `Bearer ${accessToken}` },
			params: { time_range: timeRange, limit: 50 },
		}),
	);

	const items = response.data.items;
	if (items.length === 0) return 0;

	const avgPopularity =
		items.reduce((sum: number, item: any) => sum + item.popularity, 0) /
		items.length;

	return Math.round(100 - avgPopularity);
}

export async function getTopPlaylists(
	userId: string,
	accessToken: string,
	limit: number = 10,
) {
	const result = await prisma.play.groupBy({
		by: ["playlistUri"],
		where: { userId, playlistUri: { not: null } },
		_count: { playlistUri: true },
		orderBy: { _count: { playlistUri: "desc" } },
		take: limit,
	});

	const withNames = [];
	for (const row of result) {
		const playlistId = row.playlistUri!.split(":").pop();
		try {
			const response = await spotifyRequestWithRetry(() =>
				axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				}),
			);
			withNames.push({
				playlistName: response.data.name,
				imageUrl: response.data.images?.[0]?.url ?? null,
				playCount: row._count.playlistUri,
			});
		} catch (err) {
			console.error(`Failed to resolve playlist ${playlistId}:`, err);
		}
	}

	return withNames;
}

export async function getRecap(
	userId: string,
	period: "week" | "month" | "year",
) {
	const now = new Date();
	let start: Date;

	if (period === "week") {
		start = new Date(now);
		start.setUTCDate(start.getUTCDate() - 7);
	} else if (period === "month") {
		start = new Date(
			Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, now.getUTCDate()),
		);
	} else {
		start = new Date(
			Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), now.getUTCDate()),
		);
	}

	const plays = await prisma.play.findMany({
		where: { userId, playedAt: { gte: start } },
		select: {
			durationMs: true,
			trackId: true,
			trackName: true,
			artistNames: true,
			albumArtUrl: true,
		},
	});

	const totalPlays = plays.length;
	const totalHours = Number(
		(plays.reduce((sum, p) => sum + p.durationMs, 0) / 1000 / 60 / 60).toFixed(
			1,
		),
	);

	// Top 5 tracks
	const trackCounts = new Map<
		string,
		{
			trackName: string;
			artistNames: string;
			albumArtUrl: string | null;
			count: number;
		}
	>();
	for (const p of plays) {
		const existing = trackCounts.get(p.trackId);
		if (existing) existing.count++;
		else
			trackCounts.set(p.trackId, {
				trackName: p.trackName,
				artistNames: p.artistNames,
				albumArtUrl: p.albumArtUrl,
				count: 1,
			});
	}
	const topTracks = Array.from(trackCounts.values())
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);

	// Top 5 artists (splitting comma-joined artistNames, same pattern as getTopArtists)
	const artistCounts = new Map<string, number>();
	for (const p of plays) {
		for (const artist of p.artistNames.split(", ")) {
			artistCounts.set(artist, (artistCounts.get(artist) ?? 0) + 1);
		}
	}
	const topArtists = Array.from(artistCounts.entries())
		.map(([artistName, count]) => ({ artistName, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);

	return {
		period,
		totalPlays,
		totalHours,
		topTracks,
		topArtists,
	};
}
