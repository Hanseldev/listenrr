import { prisma } from "../lib/prisma.js";
import axios from "axios";
import { getValidAccessToken } from "./spotifyAuth.js";

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
        console.log(JSON.stringify(recentlyPlayed, null, 2));
	} catch (err) {
		console.error(err);
	}
}
