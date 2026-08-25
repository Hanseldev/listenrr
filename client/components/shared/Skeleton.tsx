// components/shared/Skeleton.tsx
import { View } from "react-native";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

type SkeletonProps = {
	className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
	const opacity = useRef(new Animated.Value(0.4)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, {
					toValue: 1,
					duration: 700,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 0.4,
					duration: 700,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
			]),
		);
		loop.start();
		return () => loop.stop();
	}, []);

	return (
		<Animated.View
			style={{ opacity }}
			className={`bg-surface-2 rounded-xl ${className}`}
		/>
	);
}
