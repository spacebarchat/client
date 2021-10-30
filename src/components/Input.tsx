import React from "react";
import { TextInput, TextInputProps, useColorScheme, View } from "react-native";

export default React.forwardRef(function Input(props: TextInputProps, ref) {
	const scheme = useColorScheme();

	// @ts-ignore
	return <TextInput ref={ref} {...props} style={{ color: scheme === "light" ? "black" : "white", height: 50, ...(props.style || {}) }} />;
});
