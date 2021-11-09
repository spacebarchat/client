import React, { LegacyRef, ReactNode, useEffect, useRef, useState } from "react";
import { ScrollView, ScrollViewProps, Text, useWindowDimensions, View } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

export default function Slider(props: ScrollViewProps & { children: ReactNode[] }) {
	const { width } = useWindowDimensions();
	const snapWidth = width * 1;

	const scroller = useRef<ScrollView>();

	return (
		<ScrollView
			// @ts-ignore
			ref={scroller}
			horizontal
			bounces={false}
			snapToInterval={snapWidth}
			snapToEnd
			snapToStart
			decelerationRate="fast"
			disableIntervalMomentum
			onScrollBeginDrag={() => ReactNativeHapticFeedback.trigger("soft")}
			onMomentumScrollEnd={() => ReactNativeHapticFeedback.trigger("selection")}
			showsHorizontalScrollIndicator={false}
			{...props}
		>
			{props.children.map((x: any, i: number) => (
				<View key={i} style={{ width: snapWidth, height: "100%" }}>
					{{
						...x,
						props: {
							...x.props,
							key: i,
							next: () => {
								scroller.current?.scrollTo({ x: (i + 1) * snapWidth });
								ReactNativeHapticFeedback.trigger("soft");
							},
						},
					}}
				</View>
			))}
		</ScrollView>
	);
}
