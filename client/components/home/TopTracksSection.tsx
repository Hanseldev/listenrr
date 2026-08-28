import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import TrackCard from "./TrackCard";
import TrackCardSkeleton from "./TrackCardSkeleton";
import { Track } from "../../types/track";

type TopTracksSectionProps = {
	tracks: Track[];
	loading: boolean;
};

export default function TopTracksSection({
	tracks,
	loading,
}: TopTracksSectionProps) {
	const router = useRouter();

	return (
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
				<Pressable
					onPress={() => router.push("/stats-detail/tracks?range=all_time")}
				>
					<Text className="text-accent text-sm font-medium">See all ›</Text>
				</Pressable>
			</View>

			{loading ? (
				<View className="flex gap-1 mt-2">
					{Array.from({ length: 5 }).map((_, i) => (
						<TrackCardSkeleton key={i} />
					))}
				</View>
			) : (
				<View className="flex gap-1 mt-2">
					{tracks.map((track, index) => (
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
	);
}