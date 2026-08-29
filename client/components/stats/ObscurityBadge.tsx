import { View, Text } from "react-native";

type ObscurityBadgeProps = {
	obscurity: number;
};

export default function ObscurityBadge({ obscurity }: ObscurityBadgeProps) {
	return (
		<View className="w-24 h-24 rounded-full bg-surface-2 items-center justify-center">
			<Text className="text-text font-serif font-bold text-2xl">{obscurity}</Text>
			<Text className="text-text-sub text-[10px] uppercase">obscurity</Text>
		</View>
	);
}