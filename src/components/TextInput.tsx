import React, { forwardRef, useRef } from "react";
import { Platform, TextInput as Input, TextInputProps, View } from "react-native";

export default forwardRef(function TextInput(props: TextInputProps, ref: any) {
	if (Platform.OS === "web") return <Input className="input" ref={ref} {...props} />;

	return (
		<View className="input">
			<Input
				placeholderTextColor="grey"
				hitSlop={{ bottom: 30, left: 30, right: 30, top: 30 }}
				style={{ padding: 0 }}
				ref={ref}
				{...props}
			/>
		</View>
	);
});
