import React from "react";
import { Box, Heading, Link as L } from "native-base";
import { Link } from "../components/Router";
import { View } from "react-native";
import { tailwind } from "../util/tailwind";
import "./styles.css";

export default function NotFound() {
	return (
		<Box safeArea styleName="test" style={tailwind("h-full px-6")}>
			<Heading>Home</Heading>
			<View>
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
				<Link to="/themes/editor">Theme Editor</Link>
				<Link to="/instances">Instances</Link>
			</View>
		</Box>
	);
}
