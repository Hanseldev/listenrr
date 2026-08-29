import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { useStatsSummary } from "../../hooks/stats/useStatsSummary";
import { useCurrentlyPlaying } from "../../hooks/stats/useCurrentlyPlaying";
import { useFeaturedTrack } from "../../hooks/stats/useFeaturedTrack";
import { useFeaturedArtist } from "../../hooks/stats/useFeaturedArtist";
import { useTopAlbums } from "../../hooks/stats/useTopAlbums";
import { usePlaylists } from "../../hooks/stats/usePlaylists";
import { useObscurity } from "../../hooks/stats/useObscurity";

import TimeRangeSelector, {
	TimeRange,
} from "../../components/stats/TimeRangeSelector";
import CurrentlyPlayingBanner from "../../components/stats/CurrentlyPlayingBanner";
import CurrentlyPlayingBannerSkeleton from "../../components/stats/skeletons/CurrentlyPlayingBannerSkeleton";
import FeaturedTrackSection from "../../components/stats/FeaturedTrackSection";
import FeaturedArtistSection from "../../components/stats/FeaturedArtistSection";
import FeaturedStatCardSkeleton from "../../components/stats/skeletons/FeaturedStatCardSkeleton";
import AlbumCard from "../../components/stats/AlbumCard";
import AlbumCardSkeleton from "../../components/stats/skeletons/AlbumCardSkeleton";
import PlaylistCard from "../../components/stats/PlaylistCard";
import PlaylistCardSkeleton from "../../components/stats/skeletons/PlaylistCardSkeleton";
import ObscurityBadge from "../../components/stats/ObscurityBadge";
import ObscurityBadgeSkeleton from "../../components/stats/skeletons/ObscurityBadgeSkeleton";
import Skeleton from "../../components/shared/Skeleton";

export default function Stats() {
	const [range, setRange] = useState<TimeRange>("all_time");

	const { stats, loading: statsLoading } = useStatsSummary();
	const { currentlyPlaying, loading: currentlyPlayingLoading } =
		useCurrentlyPlaying();
	const { track: topTrack, loading: topTrackLoading } = useFeaturedTrack(range);
	const { artist: topArtist, loading: topArtistLoading } =
		useFeaturedArtist(range);
	const { albums, loading: albumsLoading } = useTopAlbums(range);
	const { playlists, loading: playlistsLoading } = usePlaylists();
	const { obscurity, loading: obscurityLoading } = useObscurity(range);

	const isPageLoading =
		statsLoading ||
		currentlyPlayingLoading ||
		topTrackLoading ||
		topArtistLoading ||
		albumsLoading ||
		playlistsLoading ||
		(range !== "all_time" && obscurityLoading);

	return (
		<ScrollView
			className="flex-1 bg-background"
			contentContainerClassName="pt-16 p-8"
		>
			<Text className="font-bold text-2xl text-text mb-4">Stats</Text>

			<TimeRangeSelector selected={range} onChange={setRange} />

			{isPageLoading ? (
				<>
					<CurrentlyPlayingBannerSkeleton />

					<View className="flex flex-row gap-3 mb-6">
						<View className="flex-1">
							<Skeleton className="w-20 h-3 mb-2" />
							<FeaturedStatCardSkeleton />
						</View>
						<View className="flex-1">
							<Skeleton className="w-20 h-3 mb-2" />
							<FeaturedStatCardSkeleton />
						</View>
					</View>

					<View className="flex flex-row items-center gap-4 mb-6">
						<View className="w-24 h-24 rounded-full bg-surface-2 items-center justify-center">
							<Skeleton className="w-10 h-6" />
						</View>
						<View className="flex-1 bg-surface rounded-xl p-4 gap-3">
							<Skeleton className="w-full h-4" />
							<Skeleton className="w-full h-4" />
						</View>
					</View>

					{range !== "all_time" && (
						<View className="mb-6">
							<Skeleton className="w-20 h-3 mb-2" />
							<ObscurityBadgeSkeleton />
						</View>
					)}

					<View className="mb-6">
						<Skeleton className="w-24 h-3 mb-2" />
						<View className="flex flex-row gap-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<AlbumCardSkeleton key={i} />
							))}
						</View>
					</View>

					<View className="mb-6">
						<Skeleton className="w-24 h-3 mb-2" />
						<View className="flex flex-row gap-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<PlaylistCardSkeleton key={i} />
							))}
						</View>
					</View>
				</>
			) : (
				<>
					<CurrentlyPlayingBanner data={currentlyPlaying} />

					<View className="flex flex-row gap-3 mb-6">
						<FeaturedTrackSection
							track={topTrack}
							loading={false}
							range={range}
						/>
						<FeaturedArtistSection
							artist={topArtist}
							loading={false}
							range={range}
						/>
					</View>

					{stats && (
						<>
							<View className="flex flex-row items-center gap-4 mb-6">
								<View className="w-24 h-24 rounded-full bg-surface-2 items-center justify-center">
									<Text className="text-text font-serif font-bold text-2xl">
										{stats.currentStreak}
									</Text>
									<Text className="text-text-sub text-[10px] uppercase">
										day streak
									</Text>
								</View>

								<View className="flex-1 bg-surface rounded-xl p-4 gap-3">
									<View className="flex flex-row justify-between">
										<Text className="text-text-sub text-xs uppercase font-semibold">
											Avg Duration
										</Text>
										<Text className="text-text font-semibold text-sm">
											{stats.avgTrackDuration}
										</Text>
									</View>
									<View className="flex flex-row justify-between">
										<Text className="text-text-sub text-xs uppercase font-semibold">
											Avg Release Year
										</Text>
										<Text className="text-text font-semibold text-sm">
											{stats.avgReleaseYear}
										</Text>
									</View>
								</View>
							</View>
						</>
					)}

					{range !== "all_time" && obscurity !== null && (
						<View className="mb-6">
							<Text className="font-serif text-text-sub font-semibold uppercase text-xs mb-2">
								Obscurity
							</Text>
							<ObscurityBadge obscurity={obscurity} />
						</View>
					)}

					<View className="mb-6">
						<View className="flex flex-row justify-between items-center mb-2">
							<Text className="font-serif text-text-sub font-semibold uppercase text-xs">
								Top Albums
							</Text>
							<Pressable
								onPress={() =>
									router.push(`/stats-detail/albums?range=${range}`)
								}
								hitSlop={8}
							>
								<Text className="text-accent text-sm font-normal">
									See all ›
								</Text>
							</Pressable>
						</View>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<View className="flex flex-row gap-3">
								{albums.map((album, i) => (
									<AlbumCard
										key={i}
										albumName={album.albumName}
										albumArtUrl={album.albumArtUrl}
										playCount={album._count?.albumName ?? album.count}
									/>
								))}
							</View>
						</ScrollView>
					</View>

					{playlists.length > 0 && (
						<View className="mb-6">
							<Text className="font-serif text-text-sub font-semibold uppercase text-xs mb-2">
								Playlists
							</Text>
							<ScrollView horizontal showsHorizontalScrollIndicator={false}>
								<View className="flex flex-row gap-3">
									{playlists.map((playlist, i) => (
										<PlaylistCard key={i} {...playlist} />
									))}
								</View>
							</ScrollView>
						</View>
					)}
				</>
			)}
		</ScrollView>
	);
}
