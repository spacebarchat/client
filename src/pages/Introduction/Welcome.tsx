import React from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import Logo from "../../assets/images/icon/Logo";
import Waves from "../../assets/images/Waves";

export default function Welcome(props: any) {
	return (
		<ScrollView bounces={false} contentContainerStyle={{ height: "100%" }}>
			<View {...props} className="introduction welcome">
				<View className="header">
					<SafeAreaView className="header">
						<Logo width={80} color="white" style={{ marginTop: 80 }} />
						<Text className="joinText" style={{ textAlign: "center", fontSize: 30, paddingTop: 50 }}>
							Join the communication revolution
						</Text>
					</SafeAreaView>
					<Waves />
				</View>

				<SafeAreaView style={{}}>
					<Button onPress={props.next} className="big">
						Continue
					</Button>
				</SafeAreaView>
			</View>
		</ScrollView>
	);
}
