import React from "react";
import { Platform, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Logo from "../../assets/images/icon/Logo";
import Waves from "../../assets/images/Waves";

export default function Welcome(props: any) {
	return (
		<View {...props} className="introduction welcome">
			<Logo width={80} color="white" />
			<Text className="joinText" style={{ textAlign: "center", fontSize: 30, paddingTop: 50 }}>
				Join the communication revolution
			</Text>
		</View>
	);
}
