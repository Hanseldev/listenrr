import { View } from "react-native";
import Skeleton from "../../shared/Skeleton";

export default function FeaturedStatCardSkeleton() {
	return (
		<View className="flex-1 bg-surface rounded-2xl p-4 items-center gap-2">
			<Skeleton className="w-24 h-24 rounded-xl" />
			<Skeleton className="w-20 h-3" />
			<Skeleton className="w-16 h-3" />
		</View>
	);
}