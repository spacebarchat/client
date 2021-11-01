import React, { useRef } from "react";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Insets, Text, ViewProps } from "react-native";
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

	return (
		<Animated.View
			style={{
				transform: [{ scale: scaleAnim }],
			}}
			{...props}
			className={(props.className || "") + " button"}
			onStartShouldSetResponder={() => true}
			onResponderRelease={(event) => {
				const isCanceled = timeout == null;
				clearTimeout(timeout);

				Animated.timing(scaleAnim, {
					useNativeDriver: true,
					toValue: 1,
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
				}, 650);
			}}
		>
			<Text className="button-text">{props.children}</Text>
		</Animated.View>
	);
}
