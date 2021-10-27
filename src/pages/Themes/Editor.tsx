import React, { useState } from "react";
import "missing-native-js-functions";
import KeyboardAvoidingView from "../../components/KeyboardAvoidingView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

export default function ThemesEditor() {
	return (
		<KeyboardAvoidingView behavior="padding">
			<SafeAreaView>
				<Text>Theme editor</Text>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}
