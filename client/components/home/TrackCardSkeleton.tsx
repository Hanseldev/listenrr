import { View } from "react-native";
import Skeleton from "../shared/Skeleton";

export default function TrackCardSkeleton() {
	return (
		<View className="flex flex-row items-center gap-3 py-2">
			<Skeleton className="w-5 h-4" />
			<Skeleton className="w-12 h-12 rounded-md" />
			<View className="flex-1 gap-1">
				<Skeleton className="w-32 h-3" />
				<Skeleton className="w-20 h-3" />
			</View>
			<Skeleton className="w-10 h-6" />
		</View>
	);
}