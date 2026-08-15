import { prisma } from "../lib/prisma.js";

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

	return sorted;
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
