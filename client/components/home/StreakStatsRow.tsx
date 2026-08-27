import { View, Text } from "react-native";
import { StatsSummary } from "../../types/stats";

type StreakStatsRowProps = {
	stats: StatsSummary;
};

export default function StreakStatsRow({ stats }: StreakStatsRowProps) {
	return (
		<View className="flex flex-row gap-3 mb-6">
			<View className="flex-1 bg-surface rounded-2xl p-4 gap-1">
				<Text className="text-text-sub text-xs uppercase font-semibold">
					Current Streak
				</Text>
				<Text className="text-text font-serif font-bold text-3xl">
					{stats.currentStreak !== undefined ? stats.currentStreak : 0}
					<Text className="text-sm font-normal"> days</Text>
				</Text>

				<View className="flex flex-row items-center">
					<Text className="text-text-sub text-xs uppercase font-semibold">
						Longest Streak: &nbsp;
					</Text>
					<Text className="text-text font-serif text-sm">
						{stats.longestStreak !== undefined ? stats.longestStreak : 0}
						<Text className="text-sm font-normal"> days</Text>
					</Text>
				</View>
			</View>

			<View className="flex-1 bg-surface rounded-2xl p-4 gap-1">
				<Text className="text-text-sub text-xs uppercase font-semibold">
					Avg Release Year
				</Text>
				<Text className="text-text font-serif font-bold text-3xl">
					{stats.avgReleaseYear}
				</Text>
			</View>
		</View>
	);
}
