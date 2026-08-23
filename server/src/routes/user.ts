import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.userId },
			select: {
				displayName: true,
				profileImageUrl: true,
			},
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (err) {
		console.error("Fetch /me error:", err);
		res.status(500).json({ error: "Failed to fetch user" });
	}
});

export default router;
