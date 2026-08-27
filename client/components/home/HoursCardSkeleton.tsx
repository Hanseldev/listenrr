import { View } from "react-native";
import Skeleton from "../shared/Skeleton";

export default function HoursCardSkeleton() {
	return (
		<View className="w-full bg-surface-2 rounded-2xl p-4 gap-4 mb-6">
			<Skeleton className="w-24 h-4" />
			<Skeleton className="w-full h-12" />
			<Skeleton className="w-3/4 h-3" />
			<View className="w-full">
				<Skeleton className="w-full h-24" />
			</View>
		</View>
	);
}