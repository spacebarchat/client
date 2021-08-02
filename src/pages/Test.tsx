import React from "react";
import { Box, StatusBar, KeyboardAvoidingView, Text, Button } from "native-base";
import { Link } from "../util/Router";

export default function () {
	return (
		<Box>
			<Link to="/login">
				<Text>Login</Text>
			</Link>
			<Link to="/channel/0/messages">
				<Text>Channel messages</Text>
			</Link>
		</Box>
	);
}
