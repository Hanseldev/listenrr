import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { scrobblerUser } from "../services/scrobbler.js";
import axios from "axios";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/spotify/exchange", async (req, res) => {
	try {
		const { code, codeVerifier, redirectUri } = req.body;

		const params = new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: redirectUri,
			client_id: process.env.SPOTIFY_CLIENT_ID!,
			client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
			code_verifier: codeVerifier,
		});

		const tokenResponse = await axios.post(
			"https://accounts.spotify.com/api/token",
			params, // URLSearchParams still works as-is
			{ headers: { "Content-Type": "application/x-www-form-urlencoded" } },
		);

		const tokenData = tokenResponse.data;

		const profileResponse = await axios.get("https://api.spotify.com/v1/me", {
			headers: { Authorization: `Bearer ${tokenData.access_token}` },
		});
		const profile = profileResponse.data;

		const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

		const user = await prisma.user.upsert({
			where: { spotifyId: profile.id },
			update: {
				spotifyAccessToken: tokenData.access_token,
				spotifyRefreshToken: tokenData.refresh_token,
				spotifyTokenExpiresAt: expiresAt,
				displayName: profile.display_name,
				profileImageUrl: profile.images?.[0]?.url ?? null,
			},
			create: {
				spotifyId: profile.id,
				spotifyAccessToken: tokenData.access_token,
				spotifyRefreshToken: tokenData.refresh_token,
				spotifyTokenExpiresAt: expiresAt,
				displayName: profile.display_name,
				profileImageUrl: profile.images?.[0]?.url ?? null,
			},
		});

		const sessionToken = jwt.sign(
			{ userId: user.id },
			process.env.JWT_SECRET!,
			{
				expiresIn: "30d",
			},
		);

		res.json({ sessionToken });
	} catch (err) {
		console.error("Exchange error:", err);
		res.status(500).json({ error: "Token exchange failed" });
	}
});

router.get("/test-scrobble/:userId", async (req, res) => {
	await scrobblerUser(req.params.userId);
	res.json({ done: true });
});

export default router;
