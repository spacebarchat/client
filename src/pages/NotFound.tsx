import React from "react";
import { Box, Heading, Link as L } from "native-base";
import Styles from "../util/Styles";
import { Link } from "../components/Router";
import { View } from "react-native";
import { tailwind } from "../util/tailwind";

export default function NotFound() {
	return (
		<Box safeArea style={tailwind("bg-blue-500 h-full px-6")}>
			<Heading>Home</Heading>
			<View>
				<Link to='/login'>Login</Link>
				<Link to='/register'>Register</Link>
				<Link to='/themes/editor'>Theme Editor</Link>
				<Link to='/instances'>Instances</Link>
			</View>
		</Box>
	);
}
