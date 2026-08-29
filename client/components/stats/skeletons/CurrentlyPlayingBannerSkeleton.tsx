import { View } from "react-native";
import Skeleton from "../../shared/Skeleton";

export default function CurrentlyPlayingBannerSkeleton() {
	return (
		<View className="flex flex-row items-center gap-3 bg-surface-2 rounded-2xl p-3 mb-4">
			<Skeleton className="w-12 h-12 rounded-md" />
			<View className="flex-1 gap-1">
				<Skeleton className="w-32 h-3" />
				<Skeleton className="w-20 h-3" />
			</View>
		</View>
	);
}