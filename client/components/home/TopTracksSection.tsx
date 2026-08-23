import { View, Text } from "react-native";
import TrackCard from "./TrackCard";
import { Track } from "../../types/track";

type TopTracksSectionProps = {
	tracks: Track[];
	loading: boolean;
};

export default function TopTracksSection({
	tracks,
	loading,
}: TopTracksSectionProps) {
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
				<Text className="text-accent text-sm font-medium">See all ›</Text>
			</View>

			{loading ? (
				<Text className="text-text-sub text-sm mt-2">Loading tracks...</Text>
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