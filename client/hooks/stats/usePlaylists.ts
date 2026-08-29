import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export function usePlaylists() {
	const [playlists, setPlaylists] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await api.get("/api/stats/playlists");
				setPlaylists(data);
			} catch (err) {
				console.error("Failed to fetch playlists:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return { playlists, loading };
}