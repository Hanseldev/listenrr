import { View, Text, ScrollView, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useStatsSummary } from "../../hooks/useStatsSummary";
import { useTopTracks } from "../../hooks/useTopTracks";
import { useTopArtists } from "../../hooks/useTopArtists";
import GreetingHeader from "../../components/home/GreetingHeader";
import HoursCard from "../../components/home/HoursCard";
import TopTracksSection from "../../components/home/TopTracksSection";
import TopArtistsSection from "../../components/home/TopArtistsSection";
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
			{loading ? (
				<Text>Loading...</Text>
			) : (
				<>
					<GreetingHeader user={user} />

					{statsLoading ? (
						<Text>Loading stats...</Text>
					) : (
						stats && <HoursCard stats={stats} />
					)}

					<TopTracksSection tracks={topTracks} loading={topTracksLoading} />
					<TopArtistsSection artists={topArtists} loading={topArtistsLoading} />

					{!statsLoading && stats && <StreakStatsRow stats={stats} />}
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
