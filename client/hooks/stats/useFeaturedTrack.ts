import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Track } from "../../types/track";

export function useFeaturedTrack(range: string) {
	const [track, setTrack] = useState<Track | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		(async () => {
			try {
				const data = await api.get(`/api/stats/top-tracks?range=${range}&limit=1`);
				setTrack(data[0] ?? null);
			} catch (err) {
				console.error("Failed to fetch top track:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, [range]);

	return { track, loading };
}