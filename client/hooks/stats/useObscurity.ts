import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export function useObscurity(range: string) {
	const [obscurity, setObscurity] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (range === "all_time") {
			setObscurity(null);
			setLoading(false);
			return;
		}
		setLoading(true);
		(async () => {
			try {
				const data = await api.get(`/api/stats/obscurity?range=${range}`);
				setObscurity(data.obscurity);
			} catch (err) {
				console.error("Failed to fetch obscurity:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, [range]);

	return { obscurity, loading };
}