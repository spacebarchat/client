import React from "react";
import { container, relativeScreenHeight } from "./Styles";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";
import { Platform, View } from "react-native";

export function ModalAvoidingView({ children }: any) {
	return (
		<KeyboardAvoidingView
			behavior="padding"
			style={{
				maxHeight: relativeScreenHeight(90),
				display: "flex",
				alignItems: "center",
				backgroundColor: "#212121",
				height: Platform.OS === "web" ? "100vh" : "100%",
				width: "100%",
				borderRadius: 20,
			}}
		>
			<View style={[container(), { height: "100%", padding: 20, borderRadius: 20 }]}>{children}</View>
		</KeyboardAvoidingView>
	);
}
