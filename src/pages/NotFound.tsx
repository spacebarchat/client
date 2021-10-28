import React from "react";
import Link from "../components/Link";
import { Text, View } from "react-native";
import { tailwind } from "../util/tailwind";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFound() {
	return (
		<SafeAreaView>
			<View style={tailwind("h-full px-6")}>
				<Text className="heading">Home</Text>
				<View>
					<Link to="/login">Login</Link>
					<Link to="/register">Register</Link>
					<Link to="/themes/editor">Theme Editor</Link>
					<Link to="/instances">Instances</Link>
				</View>
			</View>
		</SafeAreaView>
	);
}
