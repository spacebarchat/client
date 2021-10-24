import React from "react";
import { View } from "native-base";
import { container, relativeScreenHeight } from "./Styles";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";

export function ModalAvoidingView({ children }: any) {
	return (
		<KeyboardAvoidingView
			behavior="padding"
			style={{
				maxHeight: relativeScreenHeight(90),
				display: "flex",
				alignItems: "center",
				backgroundColor: "#212121",
				height: "100%",
				width: "100%",
			}}
		>
			<View style={[container(), { height: "100%", padding: 20, borderRadius: 20 }]}>{children}</View>
		</KeyboardAvoidingView>
	);
}
