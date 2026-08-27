import { prisma } from "../lib/prisma.js";
import { spotifyRequestWithRetry } from "./rateLimitResolver.js";
import { getValidAccessToken } from "./spotifyAuth.js";
import axios from "axios";

export async function getArtistImage(userId: string, artistName: string) {
	const cached = await prisma.artistImageCache.findUnique({
		where: { artistName },
	});

	if (cached && cached.imageUrl) {
		return cached.imageUrl;
	}

	try {
		const accessToken = await getValidAccessToken(userId);

		const response = await spotifyRequestWithRetry(() =>
			axios.get("https://api.spotify.com/v1/search", {
				headers: { Authorization: `Bearer ${accessToken}` },
				params: {
					q: artistName,
					type: "artist",
					limit: 5,
				},
			}),
		);

		const candidates = response.data.artists?.items ?? [];
		const match = candidates.find(
			(artist: any) =>
				artist.name.toLowerCase().trim() === artistName.toLowerCase().trim(),
		);

		const imageUrl = match?.images?.[0]?.url ?? null;

		await prisma.artistImageCache.upsert({
			where: { artistName },
			update: { imageUrl, lastFetchedAt: new Date() },
			create: { artistName, imageUrl },
		});

		return imageUrl;
	} catch (err) {
		console.error(`Failed to fetch artist image for "${artistName}":`, err);
		return cached?.imageUrl ?? null;
	}
}
