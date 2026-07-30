import "./global.css";
import { Text, View } from "react-native";

export default function App() {
	return (
		<View className="flex-1 items-center justify-center bg-white">
			<Text className="text-xl font-bold text-blue-500 p-5">
				Welcome to Nativewind!
			</Text>
		</View>
	);
}
