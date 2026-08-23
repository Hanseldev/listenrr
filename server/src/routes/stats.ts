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

const router = Router();

router.get("/summary", requireAuth, async (req, res) => {
	try {
		const totalPlaysThisMonth = await getTotalPlaysThisMonth(req.userId);
		const hoursListened = await getHoursListened(req.userId);
		const listeningTrend = await getListeningTrend(req.userId);

		const accessToken = await getValidAccessToken(req.userId);
		const avgReleaseYear =
			await getAverageReleaseYearOfLikedTracks(accessToken);

		const longestStreak = await getLongestStreak(req.userId);

		res.json({
			totalPlaysThisMonth,
			hoursListened,
			listeningTrend,
			avgReleaseYear,
			longestStreak,
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
