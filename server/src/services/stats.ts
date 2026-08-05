import { prisma } from "../lib/prisma.js";

export async function getTotalPlaysThisMonth(userId: string) {
	const now = new Date();
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	return prisma.play.count({
		where: {
			userId: userId,
			playedAt: {
				gte: startOfMonth,
			},
		},
	});
}
