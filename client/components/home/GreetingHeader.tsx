import { View, Text, Image } from "react-native";
import { UserProfile } from "../../types/user";

function getGreeting() {
	const hours = new Date().getHours();
	return hours < 12
		? "Good morning"
		: hours < 18
			? "Good afternoon"
			: "Good evening";
}

type GreetingHeaderProps = {
	user: UserProfile | null;
};

export default function GreetingHeader({ user }: GreetingHeaderProps) {
	return (
		<View className="flex flex-row justify-between items-center mb-6">
			<View className="flex">
				<Text className="font-serif text-xl text-text-sub">
					{getGreeting()},
				</Text>
				<Text className="font-serif font-bold text-2xl text-text tracking-wide">
					{user?.displayName ?? "Listener"}
				</Text>
			</View>
			<View>
				{user?.profileImageUrl && (
					<Image
						source={{ uri: user.profileImageUrl }}
						className="w-12 h-12 rounded-full"
					/>
				)}
			</View>
		</View>
	);
}
