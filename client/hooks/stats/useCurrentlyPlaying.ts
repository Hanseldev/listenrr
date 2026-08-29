import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export function useCurrentlyPlaying() {
	const [currentlyPlaying, setCurrentlyPlaying] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
	const fetchData = async () => {
		try {
			const data = await api.get("/api/stats/currently-playing");
			setCurrentlyPlaying(data);
		} catch (err) {
			console.error("Failed to fetch currently playing:", err);
		} finally {
			setLoading(false);
		}
	};

	fetchData();
	const interval = setInterval(fetchData, 20000); // every 20s
	return () => clearInterval(interval);
}, []);

	return { currentlyPlaying, loading };
}