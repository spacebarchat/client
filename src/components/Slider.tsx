import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Svg, { Circle } from "react-native-svg";

export default function Slider(props: { children: ReactNode[] }) {
	const { width, height } = useWindowDimensions();

	const [active, setActive] = useState(0);
	const relativeX = useRef(new Animated.Value(0)).current;
	const relativeY = useRef(new Animated.Value(0)).current;
	const absY = useRef(new Animated.Value(0)).current;
	const absX = useRef(new Animated.Value(0)).current;
	const onPanGestureEvent = Animated.event([{ nativeEvent: { translationX: relativeX, translationY: relativeY, y: absY, x: absX } }], {
		useNativeDriver: true,
	});

	return (
		<PanGestureHandler
			onEnded={(e) => {
				const x = e.nativeEvent.translationX as number;

				let toValue = Math.abs(x) < width / 3 ? 0 : x > 0 ? width : -width;
				if (active <= 0 && x > 0) toValue = 0;
				if (active >= props.children.length - 1 && x < 0) toValue = 0;

				Animated.spring(relativeX, {
					toValue,
					useNativeDriver: true,
					restSpeedThreshold: 20,
					restDisplacementThreshold: 5,
					bounciness: 4,
				}).start(() => {
					// Animated.timing(relativeX, { toValue: 0, useNativeDriver: true, duration: 0 }).start();
					setActive(toValue ? (x > 0 ? active - 1 : active + 1) : active);
					relativeX.setValue(0);
					console.log("done");
					ReactNativeHapticFeedback.trigger("selection");
				});
			}}
			onBegan={() => ReactNativeHapticFeedback.trigger("soft")}
			onGestureEvent={onPanGestureEvent}
		>
			<Animated.View style={{ width: "100%", height: "100%" }}>
				{props.children.map((x: any, i: number) => (
					<Animated.View
						key={i}
						style={{
							position: "absolute",
							left: 0,
							top: 0,
							height,
							width,
							transform: [{ translateX: width * (i - active) }, { translateX: i !== active ? relativeX : 0 }],
							zIndex: i !== active ? 1 : 0,
						}}
					>
						{x}
					</Animated.View>
				))}
			</Animated.View>
		</PanGestureHandler>
	);
}
