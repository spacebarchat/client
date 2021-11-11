import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigate } from "react-router";
import Button from "../../components/Button";

export default function Features(props: any) {
	const navigage = useNavigate();

	return (
		<SafeAreaView {...props} className="introduction features">
			<Text className="title">Features</Text>

			<View className="list">
				<View className="feature">
					<Text className="image">⚙️</Text>
					<Text className="name">Configurable</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}
