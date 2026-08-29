import { View, Text, Image } from "react-native";

type AlbumCardProps = {
	albumName: string;
	albumArtUrl: string | null;
	playCount?: number;
};

export default function AlbumCard({ albumName, albumArtUrl, playCount }: AlbumCardProps) {
	return (
		<View className="w-28 bg-surface rounded-2xl p-3 items-center gap-2">
			{albumArtUrl ? (
				<Image source={{ uri: albumArtUrl }} className="w-16 h-16 rounded-md" />
			) : (
				<View className="w-16 h-16 rounded-md bg-muted" />
			)}
			<Text className="text-text font-medium text-xs text-center" numberOfLines={1}>
				{albumName}
			</Text>
			{playCount !== undefined && (
				<Text className="text-accent text-xs font-semibold">{playCount} plays</Text>
			)}
		</View>
	);
}