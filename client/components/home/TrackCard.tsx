import { View, Text, Image } from "react-native";

type TrackCardProps = {
	position: number;
	trackName: string;
	artistNames: string;
	albumArtUrl: string | null;
	playCount: number;
};

export default function TrackCard({
	position,
	trackName,
	artistNames,
	albumArtUrl,
	playCount,
}: TrackCardProps) {
	return (
		<View className="flex flex-row items-center gap-3 py-2">
			<Text className="text-text-sub font-serif text-base w-5">{position}</Text>

			{albumArtUrl ? (
				<Image source={{ uri: albumArtUrl }} className="w-12 h-12 rounded-md" />
			) : (
				<View className="w-12 h-12 rounded-md bg-muted" />
			)}

			<View className="flex-1">
				<Text className="text-text font-medium text-sm" numberOfLines={1}>
					{trackName}
				</Text>
				<Text className="text-text-sub text-xs" numberOfLines={1}>
					{artistNames}
				</Text>
			</View>

			{playCount !== undefined && playCount !== null && (
				<View className="items-end">
					<Text className="text-text font-serif font-bold text-lg">
						{playCount}
					</Text>
					<Text className="text-text-sub text-[10px] uppercase">plays</Text>
				</View>
			)}
		</View>
	);
}
