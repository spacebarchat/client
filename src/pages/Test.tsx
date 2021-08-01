import React from "react";
import { Box, StatusBar, KeyboardAvoidingView, Text } from "native-base";
import { Link } from "../util/Router";

export default function () {
	return (
		<Box>
			<Link to="/login">
				<Text>Login</Text>
			</Link>
		</Box>
	);
}
