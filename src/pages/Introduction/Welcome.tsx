import React from "react";
import { Image, Platform, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Logo from "../../assets/images/icon/Logo";

export default function Welcome(props: any) {
	return (
		<View {...props} className="introduction welcome">
			<Logo width={70} color="white" />
		</View>
	);
}
