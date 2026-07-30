import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Flame, Music, RotateCcwClock, Turntable } from "lucide-react-native";
import { useSpotifyAuthRequest } from "../../lib/spotifyAuth";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export default function Login() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { request, promptAsync, redirectUri } = useSpotifyAuthRequest();
	// console.log(request)

	const handleLogin = async () => {
		setLoading(true);
		try {
			const result = await promptAsync();
			if (result.type !== "success") {
				setLoading(false);
				return;
			}

			const { code } = result.params;
			const codeVerifier = request?.codeVerifier;

			const response = await fetch(
				"http://10.132.148.100:3000/api/auth/spotify/exchange",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ code, codeVerifier, redirectUri }),
				},
			);

			if (!response.ok) {
				throw new Error("Server error");
			}

			const data = await response.json();

			if (data.sessionToken) {
				await SecureStore.setItemAsync("sessionToken", data.sessionToken);
				router.replace("/(tabs)/home"); // adjust to your actual main route
			}
		} catch (err) {
			console.error("Login failed:", err);
			Alert.alert("Something went wront", "Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View className="bg-background flex-1 items-center justify-center px-8 py-12 gap-20">
			{/* Logo mark */}
			<View className="rounded-3xl -mb-4">
				<Turntable color="#4b2e2b" size={100} />
			</View>

			{/* Title + tagline */}
			<View className="items-center -mt-14 gap-2">
				<Text className="font-serif text-5xl text-text">Listenrr</Text>
				<Text className="font-outfit text-text-sub text-lg text-center">
					Your listening life, beautifully mapped
				</Text>
			</View>

			{/* Feature hints */}
			<View className="self-stretch items-start gap-2 px-2">
				<View className="flex flex-row items-center gap-4">
					<Music color={"#4b2e2b"} size={20} />
					<Text className="font-outfit text-text-sub text-base">
						Exact play count for every track
					</Text>
				</View>

				<View className="flex flex-row items-center gap-4">
					<RotateCcwClock color={"#4b2e2b"} size={20} />
					<Text className="font-outfit text-text-sub text-base">
						Release-year timeline of your taste
					</Text>
				</View>

				<View className="flex flex-row items-center gap-4">
					<Flame color={"#4b2e2b"} size={20} />
					<Text className="font-outfit text-text-sub text-base">
						Listening activity heatmaps & streaks
					</Text>
				</View>
			</View>

			{/* CTA + footer */}
			<View className="self-stretch gap-4">
				<Pressable
					onPress={handleLogin}
					disabled={loading}
					className="bg-accent py-5 px-8 w-full items-center rounded-3xl active:opacity-80 hover:opacity-80"
				>
					{loading ? (
						<ActivityIndicator color="#FFF8F0" />
					) : (
						<Text className="font-outfit-medium text-surface text-xl">
							Continue with Spotify
						</Text>
					)}
				</Pressable>

				<Text className="font-outfit text-muted text-center text-sm">
					Read-only. Your data stays yours.
				</Text>
			</View>
		</View>
	);
}
