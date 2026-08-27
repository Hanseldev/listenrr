import axios from "axios";
import { spotifyRequestWithRetry } from "./rateLimitResolver.js";

export async function getLikedTracksPage(
	accessToken: string,
	offset: number = 0,
) {
	const response = await spotifyRequestWithRetry(() =>
		axios.get(`https://api.spotify.com/v1/me/tracks?limit=20&offset=${offset}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		}),
	);

	return response.data;
}

export async function getAllLikedTracks(accessToken: string) {
	let allTracks: any[] = [];
	let offset = 0;
	let total = Infinity;

	while (offset < total) {
		const page = await getLikedTracksPage(accessToken, offset);

		allTracks.push(...page.items);
		total = page.total;
		offset += 20;
	}

	return allTracks;
}

export async function getAverageReleaseYearOfLikedTracks(accessToken: string) {
	const allTracks = await getAllLikedTracks(accessToken);

	const years = allTracks.map((item) => {
		const releaseDate = item.track.album.release_date;
		return parseInt(releaseDate.slice(0, 4), 10);
	});

	const sum = years.reduce((total, year) => total + year, 0);
	const average = sum / years.length;

	return Math.round(average);
}
