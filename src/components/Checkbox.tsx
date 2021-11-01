import React, { useState } from "react";
import { Pressable, PressableProps, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Button, { ButtonProps } from "./Button";

export default function Checkbox(props: { state?: boolean; onChange?: Function; defaultIsChecked?: boolean } & ButtonProps) {
	const [isActive, setActive] = useState(props.defaultIsChecked ?? false);
	const active = isActive ?? props.state;

	return (
		<View className="checkbox">
			<Button
				{...props}
				onPress={() => {
					props.onChange?.(!active);
					setActive(!active);
				}}
			>
				<Text className="checkbox-state">{active ? "✓" : "x"}</Text>
			</Button>
			<Text className="label">{props.children}</Text>
		</View>
	);
}
