import { Router } from "express";
import { prisma } from "../lib/prisma.js";
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

		const tokenResponse = await fetch(
			"https://accounts.spotify.com/api/token",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: params,
			},
		);

		const tokenData = await tokenResponse.json();

		const profileResponse = await fetch("https://api.spotify.com/v1/me", {
			headers: { Authorization: `Bearer ${tokenData.access_token}` },
		});
		const profile = await profileResponse.json();

		const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

		const user = await prisma.user.upsert({
			where: { spotifyId: profile.id },
			update: {
				spotifyAccessToken: tokenData.access_token,
				spotifyRefreshToken: tokenData.refresh_token,
				spotifyTokenExpiresAt: expiresAt,
			},
			create: {
				spotifyId: profile.id,
				spotifyAccessToken: tokenData.access_token,
				spotifyRefreshToken: tokenData.refresh_token,
				spotifyTokenExpiresAt: expiresAt,
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

export default router;
