import React, { useRef } from "react";
import Slider from "../../components/Slider";
import Welcome from "./Welcome";
import Features from "./Features";
import { View } from "react-native";
import Button from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Introduction() {
	const scroller = useRef<typeof Slider>();

	return (
		<Slider
			footer={({ next }: any) => (
				<SafeAreaView>
					<Button onPress={next}>Continue</Button>
				</SafeAreaView>
			)}
		>
			<Welcome />
			<Features />
		</Slider>
	);
}
