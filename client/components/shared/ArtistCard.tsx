import { View, Text, Image } from "react-native";

type ArtistCardProps = {
	artistName: string;
	imageUrl: string | null;
	playCount?: number;
};

export default function ArtistCard({
	artistName,
	imageUrl,
	playCount,
}: ArtistCardProps) {
	return (
		<View className="w-28 bg-surface rounded-2xl p-3 items-center gap-2">
			{imageUrl ? (
				<Image source={{ uri: imageUrl }} className="w-16 h-16 rounded-full" />
			) : (
				<View className="w-16 h-16 rounded-full bg-muted" />
			)}

			<Text
				className="text-text font-medium text-xs text-center"
				numberOfLines={1}
			>
				{artistName}
			</Text>

			{playCount !== undefined && (
				<Text className="text-accent text-xs font-semibold">
					{playCount} plays
				</Text>
			)}
		</View>
	);
}
