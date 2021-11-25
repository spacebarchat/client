import React, { useEffect } from "react";
import Link from "../components/Link";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Image from "../components/Image";

export default function NotFound() {
	return (
		<SafeAreaView style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", paddingHorizontal: 15 }}>
			<View style={{ height: "100%", maxWidth: 360, width: "100%" }}>
				<Text className="title">Home</Text>

				<View>
					<Link to="/introduction">Introduction</Link>
					<Link to="/login">Login</Link>
					<Link to="/register">Register</Link>
					<Link to="/instances">Instances</Link>
					<Button>Test</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}
