import { View, Text } from "react-native";
import { Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Home() {
	return (
		<View className="flex-1 items-center justify-center bg-background">
			<Text className="text-text font-serif text-2xl">
				Welcome to Listenrr 🎧
			</Text>
			<Pressable onPress={() => SecureStore.deleteItemAsync("sessionToken")}>
				<Text>Clear session (dev only)</Text>
			</Pressable>
		</View>
	);
}
