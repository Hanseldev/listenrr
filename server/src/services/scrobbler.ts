import { prisma } from "../lib/prisma.js";
import axios from "axios";
import { getValidAccessToken } from "./spotifyAuth.js";

// input interfaces

interface SpotifyArtist {
	name: string;
}

interface SpotifyAlbumImage {
	url: string;
}

interface SpotifyAlbum {
	images: SpotifyAlbumImage[];
	release_date: string;
}

interface SpotifyTrack {
	id: string;
	name: string;
	artists: SpotifyArtist[];
	album: SpotifyAlbum;
	duration_ms: number;
}

interface SpotifyRecentlyPlayedItem {
	track: SpotifyTrack;
	played_at: string;
}

// output

interface MappedPlay {
	trackId: string;
	trackName: string;
	artistNames: string;
	albumArtUrl: string | null;
	durationMs: number;
	releaseYear: number | null;
	playedAt: Date;
}

export function mapSpotifyItemToPlay(
	item: SpotifyRecentlyPlayedItem,
): MappedPlay {
	const { track, played_at } = item;

	const trackId = track.id;
	const trackName = track.name;
	const durationMs = track.duration_ms;
	const playedAt = new Date(played_at);

	const artistNames = track.artists.map((artist) => artist.name).join(", ");

	const albumArtUrl = track.album.images[0]?.url ?? null;

	const releaseYear = track.album.release_date
		? parseInt(track.album.release_date.slice(0, 4), 10)
		: null;

	return {
		trackId,
		trackName,
		artistNames,
		albumArtUrl,
		durationMs,
		releaseYear,
		playedAt,
	};
}

export async function scrobblerUser(userId: string) {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) {
		throw new Error(`User not found ${userId}`);
	}

	const accessToken = await getValidAccessToken(user.id);

	try {
		const recentlyPlayedResponse = await axios.get(
			"https://api.spotify.com/v1/me/player/recently-played",
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			},
		);
		const recentlyPlayed = recentlyPlayedResponse.data;

		const items: SpotifyRecentlyPlayedItem[] = recentlyPlayed.items;

		for (const item of items) {
			const mapped = mapSpotifyItemToPlay(item);

			try {
				await prisma.play.create({
					data: {
						...mapped,
						userId: user.id,
					},
				});
			} catch (err: any) {
				if (err.code === "P2002") {
					continue;
				}
				throw err;
			}
			console.log(`Scrobbled ${items.length} items for user ${user.id}`);
		}
	} catch (err) {
		console.error(err);
	}
}
