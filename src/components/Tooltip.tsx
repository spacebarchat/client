import React, { ReactNode, useRef, useState } from "react";
import { Animated, Pressable, TouchableOpacity, View, ViewProps } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

export default function Tooltip(props: { children: ReactNode; tooltip: ReactNode } & ViewProps) {
	const layout = useRef({ x: 0, y: 0, width: 0, height: 0 });
	const tooltip = useRef({ x: 0, y: 0, width: 0, height: 0 });
	const opacity = useRef(new Animated.Value(0.01)).current;

	return (
		<>
			<View
				// {...props}
				className={props.className}
				style={{ overflow: "visible" }}
				onStartShouldSetResponder={() => true}
				onLayout={(e) => (layout.current = e.nativeEvent.layout)}
				onTouchEnd={() => Animated.timing(opacity, { toValue: 0, useNativeDriver: true, duration: 150 }).start()}
				onTouchStart={() => Animated.timing(opacity, { toValue: 1, useNativeDriver: true, duration: 150 }).start()} // @ts-ignore
				onMouseEnter={() => Animated.timing(opacity, { toValue: 1, useNativeDriver: true, duration: 150 }).start()} // @ts-ignore
				onMouseLeave={() => Animated.timing(opacity, { toValue: 0, useNativeDriver: true, duration: 150 }).start()}
			>
				{props.children}

				<Animated.View
					className="tooltip"
					onLayout={(e) => (tooltip.current = e.nativeEvent.layout)}
					style={{
						opacity,
						position: "absolute",
						left: 0,
						top: 0,
						borderRadius: 10,
						minHeight: "100%",
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 0,
					}}
				>
					{props.tooltip}
				</Animated.View>
			</View>
		</>
	);
}
