import { View } from "react-native";
import Skeleton from "./Skeleton";

export default function ArtistCardSkeleton() {
	return (
		<View className="w-28 bg-surface rounded-2xl p-3 items-center gap-2">
			<Skeleton className="w-16 h-16 rounded-full" />
			<Skeleton className="w-16 h-3" />
			<Skeleton className="w-12 h-3" />
		</View>
	);
}
