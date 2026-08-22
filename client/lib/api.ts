import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
	throw new Error("EXPO_PUBLIC_API_URL is not set in .env");
}

async function request(path: string, options: RequestInit = {}) {
	const token = await SecureStore.getItemAsync("sessionToken");

	const headers = {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...options.headers,
	};

	const response = await fetch(`${API_URL}${path}`, { ...options, headers });

	if (!response.ok) {
		const errorBody = await response.json().catch(() => ({}));
		throw new Error(errorBody.error || `Request failed: ${response.status}`);
	}

	return response.json();
}

export const api = {
	get: (path: string) => request(path, { method: "GET" }),
	post: (path: string, body?: unknown) =>
		request(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
};