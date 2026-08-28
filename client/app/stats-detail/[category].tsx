import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable } from "react-native";

export default function StatsDetail() {
	const { category, range } = useLocalSearchParams<{
		category: string;
		range: string;
	}>();
	const router = useRouter();

	return (
		<ScrollView
			className="flex-1 bg-background"
			contentContainerClassName="pt-16 p-8"
		>
			<Pressable onPress={() => router.back()} className="mb-6">
				<ChevronLeft color="#4B2E2B" size={24} />
			</Pressable>

			<Text className="font-serif text-2xl text-text font-bold mb-6 capitalize">
				Top {category}
			</Text>

			{/* Full list for this category + range goes here */}
		</ScrollView>
	);
}
