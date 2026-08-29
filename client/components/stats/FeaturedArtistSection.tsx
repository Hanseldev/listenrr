import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import FeaturedStatCard from "./FeaturedStatCard";
import FeaturedStatCardSkeleton from "./skeletons/FeaturedStatCardSkeleton";
import { Artist } from "../../types/artist";

type FeaturedArtistSectionProps = {
	artist: Artist | null;
	loading: boolean;
	range: string;
};

export default function FeaturedArtistSection({
	artist,
	loading,
	range,
}: FeaturedArtistSectionProps) {
	const router = useRouter();

	return (
		<View className="flex-1">
			<View className="flex flex-row justify-between items-center mb-2">
				<Text className="font-serif text-text-sub font-semibold uppercase text-xs">
					Top Artist
				</Text>
				<Pressable
					onPress={() => router.push(`/stats-detail/artists?range=${range}`)}
					hitSlop={8}
				>
					<Text className="text-accent text-lg font-bold">›</Text>
				</Pressable>
			</View>
			{loading ? (
				<FeaturedStatCardSkeleton />
			) : artist ? (
				<FeaturedStatCard
					imageUrl={artist.imageUrl}
					title={artist.artistName}
					playCount={artist.playCount}
				/>
			) : (
				<FeaturedStatCardSkeleton />
			)}
		</View>
	);
}
