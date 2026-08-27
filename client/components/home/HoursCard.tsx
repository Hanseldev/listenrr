import { View, Text, Dimensions } from "react-native";
import { CurveType, LineChart } from "react-native-gifted-charts";
import { StatsSummary } from "../../types/stats";

function percentChange(current: number, last: number): number | null {
	if (last === 0) return null;
	return Number((((current - last) / last) * 100).toFixed(0));
}

type HoursCardProps = {
	stats: StatsSummary;
};

export default function HoursCard({ stats }: HoursCardProps) {
	const screenWidth = Dimensions.get("window").width;
	const chartWidth = screenWidth - 64;

	const change = percentChange(
		Number(stats.hoursListened.currentMonthHoursListened),
		Number(stats.hoursListened.lastMonthHoursListened),
	);

	return (
		<View className="flex gap-4 w-full bg-surface-2 rounded-2xl p-4 shadow-stone-300 shadow-lg mb-6">
			<Text className="text-text-sub uppercase font-semibold text-sm">
				This Month
			</Text>
			<Text className="text-text">
				<Text className="font-black text-5xl font-serif">
					{stats.hoursListened.currentMonthHoursListened}
				</Text>{" "}
				hrs listened
			</Text>
			<Text className="text-text-sub text-xs">
				{change === null
					? "No data from last month. "
					: `Up ${change}% from last month. `}
				{stats.totalPlaysThisMonth} total plays
			</Text>

			<View className="w-full -mt-10">
				<LineChart
					data={stats.listeningTrend}
					adjustToWidth
					parentWidth={chartWidth}
					yAxisLabelWidth={0}
					xAxisLabelsHeight={0}
					height={100}
					color="#C08552"
					thickness={2}
					startFillColor="#C08552"
					endFillColor="#C08552"
					startOpacity={0.25}
					curveType={CurveType.CUBIC}
					endOpacity={0}
					areaChart
					curved
					hideDataPoints
					hideYAxisText
					hideAxesAndRules
					xAxisThickness={0}
					yAxisThickness={0}
					initialSpacing={0}
					endSpacing={0}
					disableScroll
				/>
			</View>
		</View>
	);
}
