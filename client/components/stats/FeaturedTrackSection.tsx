import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import FeaturedStatCard from "./FeaturedStatCard";
import FeaturedStatCardSkeleton from "./skeletons/FeaturedStatCardSkeleton";
import { Track } from "../../types/track";

type FeaturedTrackSectionProps = {
	track: Track | null;
	loading: boolean;
	range: string;
};

export default function FeaturedTrackSection({
	track,
	loading,
	range,
}: FeaturedTrackSectionProps) {
	const router = useRouter();

	return (
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
			{loading ? (
				<FeaturedStatCardSkeleton />
			) : track ? (
				<FeaturedStatCard
					imageUrl={track.albumArtUrl}
					title={track.trackName}
					subtitle={track.artistNames}
					playCount={track._count?.trackId}
				/>
			) : (
				<FeaturedStatCardSkeleton />
			)}
		</View>
	);
}
