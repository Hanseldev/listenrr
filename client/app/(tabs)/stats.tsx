import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { api } from "../../lib/api";
import { useStatsSummary } from "../../hooks/useStatsSummary";
import TimeRangeSelector, {
	TimeRange,
} from "../../components/stats/TimeRangeSelector";
import FeaturedStatCard from "../../components/stats/FeaturedStatCard";
import { LineChart } from "react-native-gifted-charts";
import { Dimensions } from "react-native";
import { Track } from "../../types/track";
import { Artist } from "../../types/artist";

export default function Stats() {
	const [range, setRange] = useState<TimeRange>("all_time");
	const router = useRouter();
	const { stats, loading: statsLoading } = useStatsSummary();

	const [topTrack, setTopTrack] = useState<Track | null>(null);
	const [topArtist, setTopArtist] = useState<Artist | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const tracks = await api.get(
					`/api/stats/top-tracks?range=${range}&limit=1`,
				);
				setTopTrack(tracks[0] ?? null);
			} catch (err) {
				console.error("Failed to fetch top track:", err);
			}
		})();
	}, [range]);

	useEffect(() => {
		(async () => {
			try {
				const artists = await api.get(
					`/api/stats/top-artists?range=${range}&limit=1`,
				);
				setTopArtist(artists[0] ?? null);
			} catch (err) {
				console.error("Failed to fetch top artist:", err);
			}
		})();
	}, [range]);

	const screenWidth = Dimensions.get("window").width;
	const chartWidth = screenWidth - 64;

	return (
		<ScrollView
			className="flex-1 bg-background"
			contentContainerClassName="pt-16 p-8"
		>
			<Text className="font-bold text-2xl text-text mb-4">Stats</Text>

			<TimeRangeSelector selected={range} onChange={setRange} />

			{/* Featured Track/Artist — square cards */}
			<View className="flex flex-row gap-3 mb-6">
				<View className="flex-1">
					<View className="flex flex-row justify-between items-center mb-2">
						<Text className="font-serif text-text-sub font-semibold uppercase text-xs">
							Top Track
						</Text>
						<Pressable
							onPress={() => router.push(`/stats-detail/tracks?range=${range}`)}
							hitSlop={8}
						>
							<Text className="text-accent text-lg font-bold">›</Text>
						</Pressable>
					</View>
					{topTrack && (
						<FeaturedStatCard
							imageUrl={topTrack.albumArtUrl}
							title={topTrack.trackName}
							subtitle={topTrack.artistNames}
							playCount={topTrack._count?.trackId}
						/>
					)}
				</View>

				<View className="flex-1">
					<View className="flex flex-row justify-between items-center mb-2">
						<Text className="font-serif text-text-sub font-semibold uppercase text-xs">
							Top Artist
						</Text>
						<Pressable
							onPress={() =>
								router.push(`/stats-detail/artists?range=${range}`)
							}
							hitSlop={8}
						>
							<Text className="text-accent text-lg font-bold">›</Text>
						</Pressable>
					</View>
					{topArtist && (
						<FeaturedStatCard
							imageUrl={topArtist.imageUrl}
							title={topArtist.artistName}
							playCount={topArtist.playCount}
						/>
					)}
				</View>
			</View>

			{/* Circular streak badge + wide duration/release-year strip */}
			{!statsLoading && stats && (
				<>
					<View className="flex flex-row items-center gap-4 mb-6">
						<View className="w-24 h-24 rounded-full bg-surface-2 items-center justify-center">
							<Text className="text-text font-serif font-bold text-2xl">
								{stats.currentStreak}
							</Text>
							<Text className="text-text-sub text-[10px] uppercase">
								day streak
							</Text>
						</View>

						<View className="flex-1 bg-surface rounded-xl p-4 gap-3">
							<View className="flex flex-row justify-between">
								<Text className="text-text-sub text-xs uppercase font-semibold">
									Avg Duration
								</Text>
								<Text className="text-text font-semibold text-sm">
									{stats.avgTrackDuration}
								</Text>
							</View>
							<View className="flex flex-row justify-between">
								<Text className="text-text-sub text-xs uppercase font-semibold">
									Avg Release Year
								</Text>
								<Text className="text-text font-semibold text-sm">
									{stats.avgReleaseYear}
								</Text>
							</View>
						</View>
					</View>

					{/* Chart — reused from Home, full width */}
					<View className="w-full bg-surface-2 rounded-2xl p-4 mb-6">
						<Text className="text-text-sub uppercase font-semibold text-sm mb-2">
							Listening Trend
						</Text>
						<View className="w-full -mt-6">
							<LineChart
								data={stats.listeningTrend}
								adjustToWidth
								parentWidth={chartWidth}
								yAxisLabelWidth={0}
								xAxisLabelsHeight={0}
								height={100}
								color="#C08552"
								thickness={2}
								startFillColor="#C08552"
								endFillColor="#C08552"
								startOpacity={0.25}
								endOpacity={0}
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
						</View>
					</View>
				</>
			)}
		</ScrollView>
	);
}
