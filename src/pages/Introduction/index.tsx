import React, { useRef } from "react";
import Slider from "../../components/Slider";
import Welcome from "./Welcome";
import Features from "./Features";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export default function Introduction() {
	return (
		<View style={{ height: "100%" }}>
			<Slider>
				<Welcome />
				<Features />
				<Welcome />
				<Features />
				<Welcome />
				<Features />
				<Welcome />
				<Features />
				<Welcome />
				<Features />
			</Slider>
		</View>
	);
}
