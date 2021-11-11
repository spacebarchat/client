import React, { useRef } from "react";
import Slider from "../../components/Slider";
import Welcome from "./Welcome";
import Features from "./Features";
import { View } from "react-native";

export default function Introduction() {
	return (
		<View style={{ height: "100%" }}>
			<Slider children={[<Welcome key="test" />, <Features key="test" />]} />
		</View>
	);
}
