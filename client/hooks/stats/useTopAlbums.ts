import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export function useTopAlbums(range: string, limit: number = 5) {
	const [albums, setAlbums] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		(async () => {
			try {
				const data = await api.get(`/api/stats/top-albums?range=${range}&limit=${limit}`);
				setAlbums(data);
			} catch (err) {
				console.error("Failed to fetch top albums:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, [range, limit]);

	return { albums, loading };
}