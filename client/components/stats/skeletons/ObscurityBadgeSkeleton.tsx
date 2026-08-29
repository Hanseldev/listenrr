import { View } from "react-native";
import Skeleton from "../../shared/Skeleton";

export default function ObscurityBadgeSkeleton() {
	return (
		<View className="w-24 h-24 rounded-full bg-surface-2 items-center justify-center">
			<Skeleton className="w-8 h-8 rounded-full" />
		</View>
	);
}