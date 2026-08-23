import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Track } from "../types/track";

export function useTopTracks(limit: number = 5) {
	const [topTracks, setTopTracks] = useState<Track[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await api.get(`/api/stats/top-tracks?limit=${limit}`);
				setTopTracks(data);
			} catch (err) {
				console.error("Failed to fetch /api/stats/top-tracks:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, [limit]);

	return { topTracks, loading };
}