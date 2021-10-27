import React from "react";
import { Pressable, PressableProps, Text } from "react-native";

export default function Button(props: PressableProps) {
	return (
		<Pressable {...props}>
			<Text>{props.children}</Text>
		</Pressable>
	);
}
