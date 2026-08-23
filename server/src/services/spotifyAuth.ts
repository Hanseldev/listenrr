import { prisma } from "../lib/prisma.js";
import axios from "axios";

export async function getValidAccessToken(userId: string) {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) {
		throw new Error(`User not found ${userId}`);
	}

	const currentRefreshToken = user.spotifyRefreshToken;
	try {
		if (user.spotifyTokenExpiresAt.getTime() < Date.now() + 60 * 1000) {
			const params = new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: user!.spotifyRefreshToken!,
				client_id: process.env.SPOTIFY_CLIENT_ID!,
				client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
			});

			const tokenResponse = await axios.post(
				"https://accounts.spotify.com/api/token",
				params,
				{ headers: { "Content-Type": "application/x-www-form-urlencoded" } },
			);
			const tokenData = tokenResponse.data;

			const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

			const tokenRefresh =
				tokenData.refresh_token !== undefined
					? tokenData.refresh_token
					: currentRefreshToken;

			const newUser = await prisma.user.update({
				where: { id: userId },
				data: {
					spotifyAccessToken: tokenData.access_token,
					spotifyRefreshToken: tokenRefresh,
					spotifyTokenExpiresAt: expiresAt,
				},
			});

			return newUser.spotifyAccessToken;
		} else {
			return user.spotifyAccessToken;
		}
	} catch (err) {
		console.error("Failed to refresh Spotify token:", err);
		throw err;
	}
}
