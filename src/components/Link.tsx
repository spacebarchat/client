import React, { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useHistory } from "react-router";

export default function Link(props: { to: string; children: ReactNode }) {
	const history = useHistory();

	return (
		<Pressable className="link" onPress={() => history.push(props.to)}>
			<Text className="text">{props.children}</Text>
		</Pressable>
	);
}
