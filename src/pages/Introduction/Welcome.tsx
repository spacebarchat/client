import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcome(props: any) {
	return (
		<View {...props} style={{ backgroundColor: "brown", height: "100%", ...props.style }}>
			<Text className="heading">Welcome</Text>
		</View>
	);
}
