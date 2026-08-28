import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import ArtistCard from "../shared/ArtistCard";
import ArtistCardSkeleton from "../shared/ArtistCardSkeleton";
import { Artist } from "../../types/artist";

type TopArtistsSectionProps = {
	artists: Artist[];
	loading: boolean;
};

export default function TopArtistsSection({
	artists,
	loading,
}: TopArtistsSectionProps) {
	const router = useRouter();

	return (
		<View className="w-full mb-6">
			<View className="flex flex-row justify-between items-baseline">
				<View className="flex flex-row items-baseline gap-2">
					<Text className="font-serif text-text-sub font-semibold">
						TOP ARTISTS
					</Text>
					<Text className="text-text-sub">·</Text>
					<Text className="font-serif text-text-sub font-semibold uppercase">
						All Time
					</Text>
				</View>
				<Pressable
					onPress={() => router.push("/stats-detail/artists?range=all_time")}
				>
					<Text className="text-accent text-sm font-medium">See all ›</Text>
				</Pressable>
			</View>

			{loading ? (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="mt-2"
				>
					<View className="flex flex-row gap-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<ArtistCardSkeleton key={i} />
						))}
					</View>
				</ScrollView>
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="mt-2"
				>
					<View className="flex flex-row gap-3">
						{artists.map((artist) => (
							<ArtistCard
								key={artist.artistName}
								artistName={artist.artistName}
								imageUrl={artist.imageUrl}
								playCount={artist.playCount}
							/>
						))}
					</View>
				</ScrollView>
			)}
		</View>
	);
}
