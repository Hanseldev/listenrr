import { View, Text } from "react-native";
import { Pressable, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type UserProfile = {
	displayName: string;
	profileImageUrl: string | null;
};

type StatsSummary = {
	totalPlaysThisMonth: number;
	hoursListened: {
		lastMonthHoursListened: string;
		currentMonthHoursListened: string;
	};
};

function getGreeting() {
	const hours = new Date().getHours();
	return hours < 12
		? "Good morning"
		: hours < 18
			? "Good afternoon"
			: "Good evening";
}

export default function Home() {
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

	const [stats, setStats] = useState<StatsSummary | null>(null);
	const [statsLoading, setStatsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await api.get("/api/stats/summary");
				setStats(data);
			} catch (err) {
				console.error("Failed to fetch /api/stats/summary:", err);
			} finally {
				setStatsLoading(false);
			}
		})();
	}, []);

	const percentChange = (current: number, last: number): number | null => {
		if (last === 0) return null;
		return Number(((current - last / last) * 100).toFixed(0));
	};

	const change = percentChange(
		Number(stats!.hoursListened.currentMonthHoursListened),
		Number(stats!.hoursListened.lastMonthHoursListened),
	);
	return (
		<View className="flex min-h-screen bg-background pt-16 p-8">
			{loading ? (
				<Text>Loading...</Text>
			) : (
				<>
					{/* Greeting section */}
					<View className="flex flex-row justify-between items-center mb-8">
						<View className="flex">
							<Text className="font-serif text-xl text-accent">
								{getGreeting()},
							</Text>
							<Text className="font-serif font-bold text-2xl text-text tracking-wide">
								{user?.displayName ?? "Listener"}
							</Text>
						</View>
						<View>
							{user?.profileImageUrl && (
								<Image
									source={{ uri: user.profileImageUrl }}
									className="w-12 h-12 rounded-full"
								/>
							)}
						</View>
					</View>

					{/* Hours listened section */}
					{statsLoading ? (
						<Text>Loading stats...</Text>
					) : (
						<View className="flex gap-4 w-full bg-surface-2 rounded-2xl p-4">
							<Text className="text-accent uppercase font-semibold text-sm">
								This Month
							</Text>
							<Text className="text-text">
								<Text className="font-black text-5xl font-serif">
									{stats?.hoursListened.currentMonthHoursListened}
								</Text>{" "}
								hrs listened
							</Text>
							<Text className="text-accent text-xs">
								{change === null
									? "No data from last month. "
									: `Up ${change}% from last month. `}
								{stats!.totalPlaysThisMonth} total plays
							</Text>

							{/* Insert rocky hill chart here. chart draws on its own on load */}
						</View>
					)}
				</>
			)}

			<Text className="text-text font-serif text-2xl">
				Welcome to Listenrr 🎧
			</Text>

			<Pressable
				onPress={() => SecureStore.deleteItemAsync("sessionToken")}
				className="bg-red-300 p-4 mb-4"
			>
				<Text>Clear session (dev only)</Text>
			</Pressable>

			<Pressable
				onPress={async () =>
					console.log("JWT:", await SecureStore.getItemAsync("sessionToken"))
				}
				className="bg-orange-500 p-4"
			>
				<Text>Print JWT (dev only)</Text>
			</Pressable>
		</View>
	);
}
