import React, { useState } from "react";
import { Pressable, PressableProps } from "react-native";

export default function Checkbox(props: { state?: boolean; onChange?: Function; defaultIsChecked?: boolean } & PressableProps) {
	const [isActive, setActive] = useState(props.defaultIsChecked ?? false);
	const active = isActive ?? props.state;

	return (
		<Pressable
			{...props}
			onPress={() => {
				props.onChange?.(!active);
				setActive(!active);
			}}
		>
			{active ? "✓" : "✗"}
		</Pressable>
	);
}
