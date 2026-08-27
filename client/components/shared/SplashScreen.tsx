import { View, Text } from "react-native";
import { Turntable } from "lucide-react-native";

export default function SplashScreen() {
	return (
		<View className="flex-1 bg-background items-center justify-center gap-6">
			<Turntable color="#4B2E2B" size={140} strokeWidth={1.5} />
			<Text className="text-4xl text-text tracking-wide font-semibold">
				Listenrr
			</Text>
		</View>
	);
}
