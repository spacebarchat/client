import React from "react";
import { Box, Heading } from "native-base";
import Styles from "../util/Styles";
import { Link } from "../components/Router";
import { View } from "react-native";

export default function NotFound() {
	return (
		<Box safeArea style={[Styles.h100, { alignItems: "center", display: "flex" }]}>
			<Heading>Not found</Heading>
			<View>
				<Link to="/login">Login</Link>
			</View>
		</Box>
	);
}
