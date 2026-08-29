import { View, Text, Image } from "react-native";

type FeaturedStatCardProps = {
	imageUrl: string | null;
	title: string;
	subtitle?: string;
	playCount?: number;
};

export default function FeaturedStatCard({
	imageUrl,
	title,
	subtitle,
	playCount,
}: FeaturedStatCardProps) {
	return (
		<View className="flex-1 bg-surface rounded-2xl p-4 items-center gap-2">
			{imageUrl ? (
				<Image
					source={{ uri: imageUrl }}
					className="w-24 h-24 rounded-xl"
				/>
			) : (
				<View className="w-24 h-24 rounded-xl bg-muted" />
			)}

			<Text
				className="text-text font-semibold text-sm text-center w-full"
				numberOfLines={1}
			>
				{title}
			</Text>

			{subtitle && (
				<Text
					className="text-text-sub text-xs text-center w-full"
					numberOfLines={1}
				>
					{subtitle}
				</Text>
			)}

			{playCount !== undefined ? (
				<Text className="text-accent text-xs font-semibold w-full text-center">
					{playCount} plays
				</Text>
			) : (<Text numberOfLines={1}></Text>)}
		</View>
	);
}