import React, { LegacyRef, ReactNode, useEffect, useRef, useState } from "react";
import { SafeAreaView, ScrollView, ScrollViewProps, Text, useWindowDimensions, View } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Button from "./Button";

let page = 0;

export default React.forwardRef(function Slider(props: ScrollViewProps & { children: ReactNode[]; footer: any }, ref: any) {
	const { width } = useWindowDimensions();
	const snapWidth = width * 1;

	const scroller = useRef<ScrollView>();

	function scrollNext(_: any, i?: number) {
		if (page >= props.children.length - 1) return;
		scroller.current?.scrollTo({ x: (page + 1) * snapWidth });
		ReactNativeHapticFeedback.trigger("soft");
		console.log(page + 1);
	}

	const Footer = props.footer;

	return (
		<View style={{ height: "100%", ...(props.style as any) }}>
			<ScrollView
				// @ts-ignore
				ref={scroller || ref}
				onScroll={(event) => (page = Math.floor(event.nativeEvent.contentOffset.x / snapWidth))}
				scrollEventThrottle={0}
				alwaysBounceVertical={false}
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
								next: scrollNext.bind(null, null, i),
							},
						}}
					</View>
				))}
			</ScrollView>
			{Footer && <Footer next={scrollNext} />}
		</View>
	);
});
