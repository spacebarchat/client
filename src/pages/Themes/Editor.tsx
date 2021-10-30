import React, { useState } from "react";
import "missing-native-js-functions";
import KeyboardAvoidingView from "../../components/KeyboardAvoidingView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import Link from "../../components/Link";

export default function ThemesEditor() {
	return (
		<KeyboardAvoidingView behavior="padding">
			<SafeAreaView>
				<Text className="heading">Theme editor</Text>
				<Link to="/">Home</Link>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}
