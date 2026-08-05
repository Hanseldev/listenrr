import { Router } from "express";
import { scrobblerUser } from "../services/scrobbler.js";
import { getTotalPlaysThisMonth } from "../services/stats.js";
const router = Router();

router.get("/test-scrobble/:userId", async (req, res) => {
	await scrobblerUser(req.params.userId);
	res.json({ done: true });
});

router.get(
	"/get-total-plays-this-month/:userId",
	async (req, res) => {
		const totalPlaysThisMonth = await getTotalPlaysThisMonth(req.params.userId);
		res.json({ totalPlaysThisMonth: totalPlaysThisMonth });
	},
);

export default router;
