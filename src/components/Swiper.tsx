import React, { LegacyRef, ReactNode, useEffect, useRef, useState } from "react";
import { Platform, SafeAreaView, ScrollView, ScrollViewProps, Text, useWindowDimensions, View } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Button from "./Button";

let x = 0;

export default React.forwardRef(function Slider(
	props: ScrollViewProps & {
		children: ReactNode[];
		footer: any;
	},
	ref: any
) {
	const { width } = useWindowDimensions();
	const snapWidth = width * 1;

	const scroller = useRef<ScrollView>();

	const Footer = props.footer;

	useEffect(() => {
		x = 0;
	}, []);

	function next() {
		x += snapWidth;
		scroller.current?.scrollTo({ x });
		ReactNativeHapticFeedback.trigger("soft");
	}

	return (
		<View style={{ height: "100%", ...(props.style as any) }}>
			<ScrollView
				onScroll={(e) => {
					x = e.nativeEvent.contentOffset.x;
					props.onScroll?.(e);
				}}
				// @ts-ignore
				ref={scroller || ref}
				scrollEventThrottle={0}
				horizontal
				bounces={false}
				scrollEnabled={true}
				alwaysBounceHorizontal={false}
				alwaysBounceVertical={false}
				snapToInterval={snapWidth}
				snapToEnd
				snapToStart
				decelerationRate="fast"
				disableIntervalMomentum
				onScrollBeginDrag={() => ReactNativeHapticFeedback.trigger("soft")}
				onMomentumScrollEnd={() => ReactNativeHapticFeedback.trigger("selection")}
				showsHorizontalScrollIndicator={false}
				style={{ height: "100%" }}
				contentContainerStyle={{ height: "100%" }}
				{...props}
			>
				{props.children.map((x: any, i: number) => (
					<View key={i} style={{ width: snapWidth, height: "100%" }}>
						{x}
					</View>
				))}
			</ScrollView>
			{Footer && <Footer next={next} />}
		</View>
	);
});
