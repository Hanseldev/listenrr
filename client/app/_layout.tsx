import "../global.css";
import { useFonts } from "expo-font";
import { Outfit_400Regular, Outfit_500Medium } from "@expo-google-fonts/outfit";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";
import { Slot, useRouter, useSegments } from "expo-router";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

function useAuthGate() {
	const [checked, setChecked] = useState(false);
	const router = useRouter();
	const segments = useSegments();

	useEffect(() => {
		(async () => {
			const token = await SecureStore.getItemAsync("sessionToken");
			const inAuthGroup = segments[0] === "(auth)";

			if (token && inAuthGroup) {
				router.replace("/(tabs)/home");
			} else if (!token && !inAuthGroup) {
				router.replace("/(auth)/login");
			}
			setChecked(true);
		})();
	}, [segments]);

	return checked;
}

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Outfit_400Regular,
		Outfit_500Medium,
		DMSerifDisplay_400Regular,
	});

	const authChecked = useAuthGate();

	if (!fontsLoaded || !authChecked) {
		return <View />;
	}

	return <Slot />;
}
