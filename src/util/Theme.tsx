import React from "react";
import { Pressable, Text } from "native-base";
import { Link as NativeLink } from "../components/Router";

// @ts-ignore
if (NativeLink.defaultProps) {
	// @ts-ignore
	NativeLink.defaultProps.component = (props) => {
		console.log(props);
		return (
			<Pressable
				style={{ ...props.style, padding: 10, margin: 5, backgroundColor: "#000000", borderRadius: 5 }}
				{...props}
				children={() => <Text>{props.children}</Text>}
			/>
		);
	};
}

// TODO: check if theme has correct structure
export function normalizeTheme<T extends any>(theme: T): T {
	const t = theme as any;
	if (!theme) return theme;
	if (!t.components) t.components = {};
	t.components.KeyboardAvoidingView = t.components.View;
	t.components.Box = t.components.View;

	return theme;
}
