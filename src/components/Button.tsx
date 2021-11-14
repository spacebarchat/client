import React, { useRef } from "react";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Insets, Platform, Text, View, ViewProps } from "react-native";
import { GestureResponderEvent } from "react-native-modal";
import Animated from "./Animated";

let timeout: any;

// @ts-ignore
export interface ButtonProps extends ViewProps {
	onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
	hitSlop?: null | Insets | number | undefined;
}

export default function Button(props: ButtonProps = {}) {
	const scaleAnim = useRef(new Animated.Value(1)).current;
	// offset is used on macos, because scale is applied at the top left corner
	const offset = useRef(new Animated.Value(0)).current;

	return (
		<Animated.View
			style={{
				transform: [{ scale: scaleAnim }, { translateX: offset }],
			}}
			onStartShouldSetResponder={() => true}
			onResponderRelease={(event) => {
				const isCanceled = timeout == null;
				clearTimeout(timeout);

				Animated.timing(scaleAnim, {
					useNativeDriver: true,
					toValue: 1,
					duration: 25,
				}).start();
				Animated.timing(offset, {
					useNativeDriver: true,
					toValue: 0,
					duration: 25,
				}).start();

				if (!isCanceled) props.onPress?.(event);
			}}
			isTVSelectable={true}
			focusable={true}
			accessible={true}
			hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
			onResponderStart={(event) => {
				clearTimeout(timeout);
				ReactNativeHapticFeedback.trigger("selection");

				Animated.timing(scaleAnim, {
					useNativeDriver: true,
					toValue: 0.99,
					duration: 25,
				}).start();
				if (Platform.OS === "macos") {
					Animated.timing(offset, {
						useNativeDriver: true,
						toValue: 5,
						duration: 25,
					}).start();
				}

				timeout = setTimeout(() => {
					timeout = null;
					ReactNativeHapticFeedback.trigger("notificationWarning");
					Animated.sequence([
						Animated.timing(scaleAnim, {
							useNativeDriver: true,
							toValue: 1.01,
							duration: 25,
						}),
						Animated.timing(scaleAnim, {
							useNativeDriver: true,
							toValue: 1,
							duration: 25,
						}),
					]).start();

					if (Platform.OS === "macos") {
						Animated.sequence([
							Animated.timing(offset, {
								useNativeDriver: true,
								toValue: -5,
								duration: 25,
							}),
							Animated.timing(offset, {
								useNativeDriver: true,
								toValue: 0,
								duration: 25,
							}),
						]).start();
					}
				}, 650);
			}}
		>
			<View {...(props as any)} className={(props.className || "") + " button"}>
				<Text className="text">{props.children}</Text>
			</View>
		</Animated.View>
	);
}
