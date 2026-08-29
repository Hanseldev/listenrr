import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export function useRecentlyPlayed(limit: number = 15) {
	const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await api.get(`/api/stats/recently-played?limit=${limit}`);
				setRecentlyPlayed(data);
			} catch (err) {
				console.error("Failed to fetch recently played:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, [limit]);

	return { recentlyPlayed, loading };
}