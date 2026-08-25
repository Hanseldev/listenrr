import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
	getTotalPlaysThisMonth,
	getHoursListened,
	getListeningTrend,
	getLongestStreak,
	getTopTracks,
	getTopArtists,
} from "../services/stats.js";
import { getAverageReleaseYearOfLikedTracks } from "../services/likedSongs.js";
import { getValidAccessToken } from "../services/spotifyAuth.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/summary", requireAuth, async (req, res) => {
	try {
		const cached = await prisma.statsCache.findUnique({
			where: { userId: req.userId },
		});

		if (!cached) {
			return res.status(404).json({ error: "Stats not yet computed" });
		}

		res.json({
			totalPlaysThisMonth: cached.totalPlaysThisMonth,
			hoursListened: cached.hoursListened,
			listeningTrend: cached.listeningTrend,
			avgReleaseYear: cached.avgReleaseYear,
			longestStreak: cached.longestStreak,
		});
	} catch (err) {
		console.error("Fetch /summary error:", err);
		res.status(500).json({ error: "Failed to fetch summary" });
	}
});

router.get("/top-tracks", requireAuth, async (req, res) => {
	try {
		const limit = Number(req.query.limit) || 5;
		const tracks = await getTopTracks(req.userId, limit);
		res.json(tracks);
	} catch (err) {
		console.error("Fetch /top-tracks error:", err);
		res.status(500).json({ error: "Failed to fetch top tracks" });
	}
});

router.get("/top-artists", requireAuth, async (req, res) => {
	try {
		const limit = Number(req.query.limit) || 5;
		const artists = await getTopArtists(req.userId, limit);
		res.json(artists);
	} catch (err) {
		console.error("Fetch /top-artists error:", err);
		res.status(500).json({ error: "Failed to fetch top artists" });
	}
});

export default router;
