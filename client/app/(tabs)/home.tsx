import { View, Text, ScrollView, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useUserProfile } from "../../hooks/user/useUserProfile";
import { useStatsSummary } from "../../hooks/stats/useStatsSummary";
import { useTopTracks } from "../../hooks/stats/useTopTracks";
import { useTopArtists } from "../../hooks/stats/useTopArtists";
import GreetingHeader from "../../components/home/GreetingHeader";
import HoursCard from "../../components/home/HoursCard";
import HoursCardSkeleton from "../../components/home/HoursCardSkeleton";
import TopTracksSection from "../../components/home/TopTracksSection";
import TopArtistsSection from "../../components/home/TopArtistsSection";
import StreakStatsRowSkeleton from "../../components/home/StreakStatsRowSkeleton";
import StreakStatsRow from "../../components/home/StreakStatsRow";

export default function Home() {
	const { user, loading } = useUserProfile();
	const { stats, loading: statsLoading } = useStatsSummary();
	const { topTracks, loading: topTracksLoading } = useTopTracks();
	const { topArtists, loading: topArtistsLoading } = useTopArtists();

	return (
		<ScrollView
			className="flex-1 bg-background"
			contentContainerClassName="pt-16 p-8"
		>
			<GreetingHeader user={user} />

			{statsLoading ? (
				<HoursCardSkeleton />
			) : (
				stats && <HoursCard stats={stats} />
			)}

			<TopTracksSection tracks={topTracks} loading={topTracksLoading} />
			<TopArtistsSection artists={topArtists} loading={topArtistsLoading} />

			{statsLoading ? (
				<StreakStatsRowSkeleton />
			) : (
				stats && <StreakStatsRow stats={stats} />
			)}
		</ScrollView>
	);
}
