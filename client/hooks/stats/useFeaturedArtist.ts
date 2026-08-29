import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Artist } from "../../types/artist";

export function useFeaturedArtist(range: string) {
	const [artist, setArtist] = useState<Artist | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		(async () => {
			try {
				const data = await api.get(`/api/stats/top-artists?range=${range}&limit=1`);
				setArtist(data[0] ?? null);
			} catch (err) {
				console.error("Failed to fetch top artist:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, [range]);

	return { artist, loading };
}