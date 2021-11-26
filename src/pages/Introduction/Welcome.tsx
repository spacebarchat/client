import React from "react";
import { Image, Platform, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Logo from "../../assets/images/icon/Logo";

export default function Welcome(props: any) {
	return (
		<View
			{...props}
			className="page welcome bg-primary"
			style={{ alignItems: "center", justifyContent: "center", flexGrow: 1, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}
		>
			<Logo width={70} color="white" />
		</View>
	);
}
