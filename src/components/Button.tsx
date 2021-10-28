import React from "react";
import { Pressable, PressableProps, Text } from "react-native";

export default function Button(props: PressableProps = {}) {
	return (
		<Pressable {...props} className="button">
			<Text className="test">{props.children}</Text>
		</Pressable>
	);
}
