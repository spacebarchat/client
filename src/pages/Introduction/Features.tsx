import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHistory } from "react-router";
import Button from "../../components/Button";

export default function Features(props: any) {
	const history = useHistory();

	return (
		<SafeAreaView {...props} className="introduction features">
			<Text className="title">Features</Text>

			<Button onPress={() => history.push("/")} className="big">
				Home
			</Button>
		</SafeAreaView>
	);
}
