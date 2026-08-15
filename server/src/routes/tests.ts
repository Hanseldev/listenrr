import { Router } from "express";
import { scrobblerUser } from "../services/scrobbler.js";
import {
	getTotalPlaysThisMonth,
	getHoursListened,
	getTopTracks,
	getTopArtists,
	getLongestStreak
} from "../services/stats.js";
import {
	getLikedTracksPage,
	getAllLikedTracks,
	getAverageReleaseYearOfLikedTracks,
} from "../services/likedSongs.js";
import { getValidAccessToken } from "../services/spotifyAuth.js";
const router = Router();

router.get("/test-scrobble/:userId", async (req, res) => {
	await scrobblerUser(req.params.userId);
	res.json({ done: true });
});

router.get("/get-total-plays-this-month/:userId", async (req, res) => {
	const totalPlaysThisMonth = await getTotalPlaysThisMonth(req.params.userId);
	res.json({ totalPlaysThisMonth: totalPlaysThisMonth });
});

router.get("/hours-listened/:userId", async (req, res) => {
	const result = await getHoursListened(req.params.userId);
	res.json(result);
});

router.get("/top-tracks/:userId", async (req, res) => {
	const result = await getTopTracks(req.params.userId);
	res.json(result);
});

router.get("/top-artists/:userId", async (req, res) => {
	const result = await getTopArtists(req.params.userId);
	res.json(result);
});

router.get("/liked-tracks/:userId", async (req, res) => {
	const accessToken = await getValidAccessToken(req.params.userId);
	const result = await getLikedTracksPage(accessToken);
	res.json(result);
});

router.get("/liked-tracks-all/:userId", async (req, res) => {
	const accessToken = await getValidAccessToken(req.params.userId);
	const allTracks = await getAllLikedTracks(accessToken);
	res.json({ count: allTracks.length });
});

router.get("/avg-release-year-liked/:userId", async (req, res) => {
	const accessToken = await getValidAccessToken(req.params.userId);
	const result = await getAverageReleaseYearOfLikedTracks(accessToken);
	res.json({ averageReleaseYear: result });
});

router.get("/longest-streak/:userId", async (req, res) => {
  const result = await getLongestStreak(req.params.userId);
  res.json({ longestStreak: result });
});

export default router;
