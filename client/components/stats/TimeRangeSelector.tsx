import { View, Text, Pressable } from "react-native";

export type TimeRange = "all_time" | "short_term" | "medium_term" | "long_term";

const OPTIONS: { label: string; value: TimeRange }[] = [
	{ label: "All Time", value: "all_time" },
	{ label: "4 Weeks", value: "short_term" },
	{ label: "6 Months", value: "medium_term" },
	{ label: "1 Year+", value: "long_term" },
];

type TimeRangeSelectorProps = {
	selected: TimeRange;
	onChange: (range: TimeRange) => void;
};

export default function TimeRangeSelector({
	selected,
	onChange,
}: TimeRangeSelectorProps) {
	return (
		<View className="flex flex-row gap-2 mb-4">
			{OPTIONS.map((option) => {
				const isActive = option.value === selected;
				return (
					<Pressable
						key={option.value}
						onPress={() => onChange(option.value)}
						className={`px-3 py-1.5 rounded-full ${
							isActive ? "bg-accent" : "bg-surface-2"
						}`}
					>
						<Text
							className={`text-xs font-medium ${
								isActive ? "text-background" : "text-text-sub"
							}`}
						>
							{option.label}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
}
