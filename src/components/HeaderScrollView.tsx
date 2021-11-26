import React, { Children, ReactNode, useRef } from "react";
import { Animated, Easing, ScrollView, ScrollViewProps, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface HeaderScrollView extends ScrollViewProps {
	title: string;
	headerStyle?: any;
	titleStyle?: any;
}

export default function HeaderScrollView(props: HeaderScrollView) {
	const y = useRef(new Animated.Value(0)).current;
	const safeArea = useSafeAreaInsets();

	return (
		<>
			<Animated.View
				className="bg"
				style={{
					position: "absolute",
					top: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: "100%",
					height: 40,
					zIndex: 1,
				}}
			>
				<Animated.Text
					style={{
						opacity: y.interpolate({
							inputRange: [40, 50],
							outputRange: [0, 1],
							extrapolate: "clamp",
						}),
						fontWeight: "600",
						...props.headerStyle,
					}}
				>
					{props.title}
				</Animated.Text>
			</Animated.View>
			<Animated.ScrollView
				alwaysBounceVertical={true}
				bounces={true}
				{...props}
				scrollEventThrottle={16}
				style={{ height: "100%", ...(props.style as any) }}
				onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: true })}
			>
				<Animated.Text
					className="title"
					style={{
						fontWeight: "900",
						textAlign: "left",
						transform: [
							{
								scale: y.interpolate({
									inputRange: [-100, 0],
									outputRange: [1.2, 1],
									extrapolate: "clamp",
								}),
							},
						],
						...props.titleStyle,
					}}
				>
					{props.title}
				</Animated.Text>
				{props.children}
			</Animated.ScrollView>
		</>
	);
}

// Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: false })
