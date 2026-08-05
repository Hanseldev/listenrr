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
