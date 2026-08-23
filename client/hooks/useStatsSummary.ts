import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { StatsSummary } from "../types/stats";

export function useStatsSummary() {
	const [stats, setStats] = useState<StatsSummary | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await api.get("/api/stats/summary");
				setStats(data);
			} catch (err) {
				console.error("Failed to fetch /api/stats/summary:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return { stats, loading };
}