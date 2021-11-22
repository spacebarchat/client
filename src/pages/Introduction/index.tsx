import React, { useEffect, useRef, useState } from "react";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Swiper from "../../components/Swiper";
import Welcome from "./Welcome";
import Features from "./Features";
import Button from "../../components/Button";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigate } from "react-router";
import { Text, useWindowDimensions, View } from "react-native";

let page = 0;

export default function Introduction() {
	const navigate = useNavigate();
	const scroller = useRef<typeof Swiper>();
	const { width } = useWindowDimensions();
	const insets = useSafeAreaInsets();

	useEffect(() => {
		page = 0;
	});

	return (
		<Swiper
			ref={scroller}
			onScroll={(event) => (page = Math.round(event.nativeEvent.contentOffset.x / width))}
			footer={({ next }: any) => (
				<View style={{ paddingBottom: insets.bottom }}>
					<Button onPress={() => (page >= 1 ? navigate("/") : next())}>Continue</Button>
				</View>
			)}
		>
			<Welcome />
			<Features />
		</Swiper>
	);
}
