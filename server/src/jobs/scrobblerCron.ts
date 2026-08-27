import { prisma } from "../lib/prisma.js";
import { scrobblerUser } from "../services/scrobbler.js";
import { computeAndCacheStats } from "../services/statsCache.js";
import cron from "node-cron";

export async function scrobbleAllUsers() {
	const users = await prisma.user.findMany({ select: { id: true } });

	for (const user of users) {
		try {
			await scrobblerUser(user.id);
			await computeAndCacheStats(user.id);
		} catch (err) {
			console.error(`Failed to process user ${user.id}:`, err);
		}
	}
}

export function runCronJob() {
	// scrobbleAllUsers();

	cron.schedule("*/15 * * * *", () => {
		scrobbleAllUsers();
	});
}
