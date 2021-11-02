import React from "react";
import Slider from "../../components/Slider";
import Welcome from "./Welcome";
import Features from "./Features";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Introduction() {
	return (
		<SafeAreaView>
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
		</SafeAreaView>
	);
}
