import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getValidAccessToken } from "../services/spotifyAuth.js";
import {
	getTopTracks,
	getTopArtists,
	getSpotifyTopTracks,
	getSpotifyTopArtists,
	getRecentlyPlayed,
	getSpotifyTopAlbums,
	getTopAlbums,
	getCurrentlyPlaying,
	getGenreBreakdown,
	getAverageObscurity,
	getRecap,
	getTopPlaylists,
} from "../services/stats.js";

import { prisma } from "../lib/prisma.js";

const router = Router();

type SpotifyRange = "short_term" | "medium_term" | "long_term";

function isSpotifyRange(range: unknown): range is SpotifyRange {
	return (
		range === "short_term" || range === "medium_term" || range === "long_term"
	);
}

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
			currentStreak: cached.currentStreak,
			avgTrackDuration: cached.avgTrackDuration,
		});
	} catch (err) {
		console.error("Fetch /summary error:", err);
		res.status(500).json({ error: "Failed to fetch summary" });
	}
});

router.get("/top-tracks", requireAuth, async (req, res) => {
	try {
		const limit = Number(req.query.limit) || 5;
		const range = req.query.range;

		if (isSpotifyRange(range)) {
			const accessToken = await getValidAccessToken(req.userId);
			const tracks = await getSpotifyTopTracks(accessToken, range, limit);
			return res.json(tracks);
		}

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
		const range = req.query.range;

		if (isSpotifyRange(range)) {
			const accessToken = await getValidAccessToken(req.userId);
			const artists = await getSpotifyTopArtists(accessToken, range, limit);
			return res.json(artists);
		}

		const artists = await getTopArtists(req.userId, limit);
		res.json(artists);
	} catch (err) {
		console.error("Fetch /top-artists error:", err);
		res.status(500).json({ error: "Failed to fetch top artists" });
	}
});

router.get("/top-albums", requireAuth, async (req, res) => {
	try {
		const limit = Number(req.query.limit) || 5;
		const range = req.query.range;

		if (isSpotifyRange(range)) {
			const accessToken = await getValidAccessToken(req.userId);
			const albums = await getSpotifyTopAlbums(accessToken, range, limit);
			return res.json(albums);
		}

		const albums = await getTopAlbums(req.userId, limit);
		res.json(albums);
	} catch (err) {
		console.error("Fetch /top-albums error:", err);
		res.status(500).json({ error: "Failed to fetch top albums" });
	}
});

router.get("/currently-playing", requireAuth, async (req, res) => {
	try {
		const data = await getCurrentlyPlaying(req.userId);
		res.json(data);
	} catch (err) {
		console.error("Fetch /currently-playing error:", err);
		res.status(500).json({ error: "Failed to fetch currently playing" });
	}
});

router.get("/recently-played", requireAuth, async (req, res) => {
	try {
		const limit = Number(req.query.limit) || 20;
		const plays = await getRecentlyPlayed(req.userId, limit);
		res.json(plays);
	} catch (err) {
		console.error("Fetch /recently-played error:", err);
		res.status(500).json({ error: "Failed to fetch recently played" });
	}
});

router.get("/genres", requireAuth, async (req, res) => {
	try {
		const range = req.query.range;
		if (!isSpotifyRange(range)) {
			return res
				.status(400)
				.json({
					error:
						"Genres require a Spotify time range (short_term, medium_term, or long_term)",
				});
		}
		const accessToken = await getValidAccessToken(req.userId);
		const genres = await getGenreBreakdown(accessToken, range);
		res.json(genres);
	} catch (err) {
		console.error("Fetch /genres error:", err);
		res.status(500).json({ error: "Failed to fetch genres" });
	}
});

router.get("/obscurity", requireAuth, async (req, res) => {
	try {
		const range = req.query.range;
		if (!isSpotifyRange(range)) {
			return res.status(400).json({
				error:
					"Obscurity requires a Spotify time range (short_term, medium_term, or long_term)",
			});
		}
		const accessToken = await getValidAccessToken(req.userId);
		const obscurity = await getAverageObscurity(accessToken, range);
		res.json({ obscurity });
	} catch (err) {
		console.error("Fetch /obscurity error:", err);
		res.status(500).json({ error: "Failed to fetch obscurity" });
	}
});

router.get("/playlists", requireAuth, async (req, res) => {
	try {
		const accessToken = await getValidAccessToken(req.userId);
		const playlists = await getTopPlaylists(req.userId, accessToken);
		res.json(playlists);
	} catch (err) {
		console.error("Fetch /playlists error:", err);
		res.status(500).json({ error: "Failed to fetch playlists" });
	}
});

router.get("/recap", requireAuth, async (req, res) => {
	try {
		const period = req.query.period as "week" | "month" | "year";
		if (!["week", "month", "year"].includes(period)) {
			return res
				.status(400)
				.json({ error: "period must be week, month, or year" });
		}
		const recap = await getRecap(req.userId, period);
		res.json(recap);
	} catch (err) {
		console.error("Fetch /recap error:", err);
		res.status(500).json({ error: "Failed to fetch recap" });
	}
});

export default router;
