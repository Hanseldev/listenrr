import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export function useGenres(range: string) {
	const [genres, setGenres] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (range === "all_time") {
			setGenres([]);
			setLoading(false);
			return;
		}
		setLoading(true);
		(async () => {
			try {
				const data = await api.get(`/api/stats/genres?range=${range}`);
				setGenres(data);
			} catch (err) {
				console.error("Failed to fetch genres:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, [range]);

	return { genres, loading };
}