import { View } from "react-native";
import Skeleton from "../shared/Skeleton";

export default function StreakStatsRowSkeleton() {
	return (
		<View className="flex flex-row gap-3 mb-6">
			<View className="flex-1 bg-surface rounded-2xl p-4 gap-2">
				<Skeleton className="w-20 h-3" />
				<Skeleton className="w-16 h-8" />
			</View>
			<View className="flex-1 bg-surface rounded-2xl p-4 gap-2">
				<Skeleton className="w-20 h-3" />
				<Skeleton className="w-16 h-8" />
			</View>
		</View>
	);
}
