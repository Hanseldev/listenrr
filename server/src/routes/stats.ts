import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getTopTracks } from "../services/stats.js";

const router = Router();

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

export default router;
