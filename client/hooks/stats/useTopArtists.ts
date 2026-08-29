import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Artist } from "../../types/artist";

export function useTopArtists(limit: number = 5) {
	const [topArtists, setTopArtists] = useState<Artist[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await api.get(`/api/stats/top-artists?limit=${limit}`);
				setTopArtists(data);
			} catch (err) {
				console.error("Failed to fetch /api/stats/top-artists:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, [limit]);

	return { topArtists, loading };
}