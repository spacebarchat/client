import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Platform, ScrollViewProps, useWindowDimensions, View, ViewProps } from "react-native";
import useSafeAreaStyle from "../util/useSafeAreaStyle";

export interface KeyboardAvoidingViewProps extends ViewProps {
	behavior?: "height" | "position" | "padding" | undefined;
	safeArea?: boolean;
	scrollView?: boolean;
}

export default function KeyboardAvoidingView(props: KeyboardAvoidingViewProps) {
	const h = useWindowDimensions().height;
	const padding = useRef(new Animated.Value(0)).current;
	const height = useRef(new Animated.Value(h)).current;
	const safeArea = useSafeAreaStyle();

	useEffect(() => {
		if (Platform.OS === "android") return;
		const show = Keyboard.addListener("keyboardWillShow", (e) => {
			Animated.timing(height, {
				useNativeDriver: false,
				toValue: e.endCoordinates.screenY + safeArea.paddingBottom + ((props.style as any)?.paddingBottom || 0),
				duration: 200,
			}).start();
			Animated.timing(padding, {
				useNativeDriver: false,
				toValue: h - e.endCoordinates.screenY,
				duration: 200,
			}).start();
		});
		const close = Keyboard.addListener("keyboardWillHide", (e) => {
			Animated.timing(height, { useNativeDriver: false, toValue: h, duration: 200 }).start();

			Animated.timing(padding, {
				useNativeDriver: false,
				toValue: 0,
				duration: 200,
			}).start();
		});

		return () => {
			show.remove();
			close.remove();
		};
	}, []);

	let style: any = {};

	if (props.safeArea) style = { ...style, ...safeArea };
	if (props.behavior === "height" || !props.behavior) style.height = height;
	else if (props.behavior === "position") style.bottom = padding;
	else if (props.behavior === "padding") style.paddingBottom = padding;

	return (
		<Animated.View
			{...props}
			style={{ ...safeArea, ...(props.style as any), ...style, minHeight: Platform.OS !== "android" ? "100%" : undefined }}
		/>
	);
}
