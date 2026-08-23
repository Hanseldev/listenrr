import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { UserProfile } from "../types/user";

export function useUserProfile() {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await api.get("/api/me");
				setUser(data);
			} catch (err) {
				console.error("Failed to fetch /api/me:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return { user, loading };
}
