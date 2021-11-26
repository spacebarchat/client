import React, { forwardRef, useRef } from "react";
import { Platform, TextInput as Input, TextInputProps, useColorScheme, View } from "react-native";

export default forwardRef(function TextInput(props: TextInputProps, ref: any) {
	if (Platform.OS === "web") return <Input className="input" ref={ref} {...props} />;
	const theme = useColorScheme();

	return (
		// @ts-ignore
		<View className="input" style={{ width: props.style?.width }}>
			<Input
				placeholderTextColor="grey"
				hitSlop={{ bottom: 30, left: 30, right: 30, top: 30 }}
				ref={ref}
				style={{ padding: 0, color: theme === "dark" ? "white" : "black" }}
				{...props}
			/>
		</View>
	);
});
