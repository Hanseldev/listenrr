import { View, Text, ScrollView } from "react-native";
import { ScrollView as HScrollView } from "react-native";
import { Pressable, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import TrackCard from "../../components/home/TrackCard";
import { LineChart } from "react-native-gifted-charts";
import { Dimensions } from "react-native";
import ArtistCard from "../../components/shared/ArtistCard";

type UserProfile = {
	displayName: string;
	profileImageUrl: string | null;
};

type TrendPoint = {
	value: number;
	label: string;
};

type StatsSummary = {
	totalPlaysThisMonth: number;
	hoursListened: {
		lastMonthHoursListened: string;
		currentMonthHoursListened: string;
	};
	listeningTrend: TrendPoint[];
	avgReleaseYear: number;
	longestStreak: number;
};

type Track = {
	trackId: string;
	trackName: string;
	artistNames: string;
	albumArtUrl: string | null;
	_count: { trackId: number };
};

type Artist = {
	artistName: string;
	imageUrl: string | null;
	playCount: number;
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

	const [topTracks, setTopTracks] = useState<Track[]>([]);
	const [topTracksLoading, setTopTracksLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await api.get("/api/stats/top-tracks?limit=5");
				setTopTracks(data);
			} catch (err) {
				console.error("Failed to fetch /api/stats/top-tracks:", err);
			} finally {
				setTopTracksLoading(false);
			}
		})();
	}, []);

	const [topArtists, setTopArtists] = useState<Artist[]>([]);
	const [topArtistsLoading, setTopArtistsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await api.get("/api/stats/top-artists?limit=5");
				setTopArtists(data);
			} catch (err) {
				console.error("Failed to fetch /api/stats/top-artists:", err);
			} finally {
				setTopArtistsLoading(false);
			}
		})();
	}, []);

	const percentChange = (current: number, last: number): number | null => {
		if (last === 0) return null;
		return Number((((current - last) / last) * 100).toFixed(0));
	};

	const change = stats
		? percentChange(
				Number(stats.hoursListened.currentMonthHoursListened),
				Number(stats.hoursListened.lastMonthHoursListened),
			)
		: null;

	const screenWidth = Dimensions.get("window").width;
	const chartWidth = screenWidth - 64;

	return (
		<ScrollView
			className="flex-1 bg-background"
			contentContainerClassName="pt-16 p-8"
		>
			{loading ? (
				<Text>Loading...</Text>
			) : (
				<>
					{/* Greeting section */}
					<View className="flex flex-row justify-between items-center mb-6">
						<View className="flex">
							<Text className="font-serif text-xl text-text-sub">
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
						<View className="flex gap-4 w-full bg-surface-2 rounded-2xl p-4 shadow-stone-300 shadow-lg mb-6">
							<Text className="text-text-sub uppercase font-semibold text-sm">
								This Month
							</Text>
							<Text className="text-text">
								<Text className="font-black text-5xl font-serif">
									{stats?.hoursListened.currentMonthHoursListened}
								</Text>{" "}
								hrs listened
							</Text>
							<Text className="text-text-sub text-xs">
								{change === null
									? "No data from last month. "
									: `Up ${change}% from last month. `}
								{stats?.totalPlaysThisMonth} total plays
							</Text>

							<View className="w-full -mt-16">
								{stats && (
									<LineChart
										data={stats.listeningTrend}
										adjustToWidth
										parentWidth={chartWidth}
										yAxisLabelWidth={0}
										xAxisLabelsHeight={0}
										height={100}
										color="#C08552"
										thickness={2.5}
										startFillColor="#C08552"
										endFillColor="#C08552"
										startOpacity={0.15}
										endOpacity={0.1}
										areaChart
										curved
										hideDataPoints
										hideYAxisText
										hideAxesAndRules
										xAxisThickness={0}
										yAxisThickness={0}
										initialSpacing={0}
										endSpacing={0}
										disableScroll
									/>
								)}
							</View>
						</View>
					)}

					{/* Top tracks section */}
					<View className="w-full mb-6">
						<View className="flex flex-row justify-between items-baseline">
							<View className="flex flex-row items-baseline gap-2">
								<Text className="font-serif text-text-sub font-semibold">
									TOP TRACKS
								</Text>
								<Text className="text-text-sub">·</Text>
								<Text className="font-serif text-text-sub font-semibold uppercase">
									All Time
								</Text>
							</View>
							<Text className="text-accent text-sm font-medium">See all ›</Text>
						</View>

						{topTracksLoading ? (
							<Text className="text-text-sub text-sm mt-2">
								Loading tracks...
							</Text>
						) : (
							<View className="flex gap-1 mt-2">
								{topTracks.map((track, index) => (
									<TrackCard
										key={track.trackId}
										position={index + 1}
										trackName={track.trackName}
										artistNames={track.artistNames}
										albumArtUrl={track.albumArtUrl}
										playCount={track._count.trackId}
									/>
								))}
							</View>
						)}
					</View>

					{/* Top artists section */}
					<View className="w-full mb-6">
						<View className="flex flex-row justify-between items-baseline">
							<View className="flex flex-row items-baseline gap-2">
								<Text className="font-serif text-text-sub font-semibold">
									TOP ARTISTS
								</Text>
								<Text className="text-text-sub">·</Text>
								<Text className="font-serif text-text-sub font-semibold uppercase">
									All Time
								</Text>
							</View>
							<Text className="text-accent text-sm font-medium">See all ›</Text>
						</View>

						{topArtistsLoading ? (
							<Text className="text-text-sub text-sm mt-2">
								Loading artists...
							</Text>
						) : (
							<HScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								className="mt-2"
							>
								<View className="flex flex-row gap-3">
									{topArtists.map((artist) => (
										<ArtistCard
											key={artist.artistName}
											artistName={artist.artistName}
											imageUrl={artist.imageUrl}
											playCount={artist.playCount}
										/>
									))}
								</View>
							</HScrollView>
						)}
					</View>

					{/* Small stats row */}
					{!statsLoading && stats && (
						<View className="flex flex-row gap-3 mb-6">
							<View className="flex-1 bg-surface rounded-2xl p-4 gap-1">
								<Text className="text-text-sub text-xs uppercase font-semibold">
									Longest Streak
								</Text>
								<Text className="text-text font-serif font-bold text-3xl">
									{stats.longestStreak}
									<Text className="text-sm font-normal"> days</Text>
								</Text>
							</View>

							<View className="flex-1 bg-surface rounded-2xl p-4 gap-1">
								<Text className="text-text-sub text-xs uppercase font-semibold">
									Avg Release Year
								</Text>
								<Text className="text-text font-serif font-bold text-3xl">
									{stats.avgReleaseYear}
								</Text>
							</View>
						</View>
					)}
				</>
			)}

			<Pressable
				onPress={() => SecureStore.deleteItemAsync("sessionToken")}
				className="bg-red-300 p-4 mb-4 hidden"
			>
				<Text>Clear session (dev only)</Text>
			</Pressable>

			<Pressable
				onPress={async () =>
					console.log("JWT:", await SecureStore.getItemAsync("sessionToken"))
				}
				className="bg-orange-500 p-4 hidden"
			>
				<Text>Print JWT (dev only)</Text>
			</Pressable>
		</ScrollView>
	);
}
