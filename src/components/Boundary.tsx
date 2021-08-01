import React, { ReactNode } from "react";
import { Box, StatusBar, KeyboardAvoidingView, useTheme } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeModules, PanResponder } from "react-native";
const fullWidth = { width: "100%", height: "100%" };

export default function ({ children }: { children: ReactNode }) {
	const theme = useTheme();
	console.log(theme.config.initialColorMode);

	return (
		<Box style={fullWidth} backgroundColor={"backgroundColor.400"}>
			<StatusBar
				barStyle={theme.config.initialColorMode === "dark" ? "light-content" : "dark-content"}
			></StatusBar>
			<SafeAreaView style={fullWidth}>
				<KeyboardAvoidingView style={fullWidth} behavior="padding">
					{children}
				</KeyboardAvoidingView>
			</SafeAreaView>
		</Box>
	);
}
