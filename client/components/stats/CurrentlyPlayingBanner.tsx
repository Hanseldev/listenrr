import { View, Text, Image } from "react-native";

type CurrentlyPlayingBannerProps = {
	data: {
		trackName: string;
		artistNames: string;
		albumArtUrl: string | null;
		isPlaying: boolean;
	} | null;
};

export default function CurrentlyPlayingBanner({
	data,
}: CurrentlyPlayingBannerProps) {
	if (!data) return null;

	return (
		<View className="flex flex-row items-center gap-3 bg-surface-2 rounded-2xl p-3 mb-4">
			{data.albumArtUrl ? (
				<Image
					source={{ uri: data.albumArtUrl }}
					className="w-12 h-12 rounded-md"
				/>
			) : (
				<View className="w-12 h-12 rounded-md bg-muted" />
			)}
			<View className="flex-1">
				<Text className="text-text font-medium text-sm" numberOfLines={1}>
					{data.trackName}
				</Text>
				<Text className="text-text-sub text-xs" numberOfLines={1}>
					{data.artistNames}
				</Text>
			</View>
			<View
				className={`w-2 h-2 rounded-full ${data.isPlaying ? "bg-accent" : "bg-muted"}`}
			/>
		</View>
	);
}
