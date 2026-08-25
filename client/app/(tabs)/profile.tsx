import { View, Text, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function Profile() {
	const router = useRouter();

	const handleLogout = async () => {
		await SecureStore.deleteItemAsync("sessionToken");
		router.replace("/(auth)/login");
	};

	return (
		<View className="flex-1 bg-background pt-16 p-8">
			<Text className="text-text font-serif text-2xl font-bold mb-8">
				Profile
			</Text>

			<View className="w-full bg-surface-2 rounded-2xl p-4 mb-4">
				<Text className="text-text-sub text-sm uppercase font-semibold mb-1">
					Historical Data Export
				</Text>
				<Text className="text-text-sub text-xs">Coming soon</Text>
			</View>

			<Pressable
				onPress={handleLogout}
				className="bg-surface rounded-2xl p-4 items-center"
			>
				<Text className="text-accent font-medium">Log Out</Text>
			</Pressable>
		</View>
	);
}