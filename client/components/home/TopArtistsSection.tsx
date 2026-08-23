import { View, Text, ScrollView } from "react-native";
import ArtistCard from "../shared/ArtistCard";
import { Artist } from "../../types/artist";

type TopArtistsSectionProps = {
	artists: Artist[];
	loading: boolean;
};

export default function TopArtistsSection({
	artists,
	loading,
}: TopArtistsSectionProps) {
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
				<Text className="text-accent text-sm font-medium">See all ›</Text>
			</View>

			{loading ? (
				<Text className="text-text-sub text-sm mt-2">Loading artists...</Text>
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