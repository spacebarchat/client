import React from "react";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Link from "../components/Link";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";

export default function NotFound() {
	return (
		<SafeAreaView>
			<Text className="heading title">Home</Text>
			<View>
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
				<Link to="/themes/editor">Theme Editor</Link>
				<Link to="/instances">Instances</Link>
				<Button className="link">Test</Button>
			</View>
		</SafeAreaView>
	);
}
