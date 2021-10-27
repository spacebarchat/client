import React, { ReactNode } from "react";
import { Pressable, Text } from "react-native";
import { useHistory } from "react-router";

export default function Link(props: { to: string; children: ReactNode }) {
	const history = useHistory();

	return (
		<Pressable onPress={() => history.push(props.to)}>
			<Text>{props.children}</Text>
		</Pressable>
	);
}
