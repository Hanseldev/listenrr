import { Router } from "express";
import { scrobblerUser } from "../services/scrobbler.js";
import { getTotalPlaysThisMonth, getHoursListened, getTopTracks } from "../services/stats.js";
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

export default router;
