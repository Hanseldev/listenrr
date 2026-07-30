import "../global.css";
import { useFonts } from "expo-font";
import { Outfit_400Regular, Outfit_500Medium } from "@expo-google-fonts/outfit";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";
import { Slot } from "expo-router";
import { View } from "react-native";
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession()

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Outfit_400Regular,
		Outfit_500Medium,
		DMSerifDisplay_400Regular,
	});

	if (!fontsLoaded) {
		return <View />;
	}

	return <Slot />;
}
