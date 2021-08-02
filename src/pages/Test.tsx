import React from "react";
import { Box, StatusBar, KeyboardAvoidingView, Text, Button } from "native-base";
import { Link } from "../util/Router";

export default function ({ navigation }: any) {
	return (
		<Box>
			<Button onPress={() => navigation.openDrawer()}>Open Drawer</Button>
			<Link to="/login">
				<Text>Login</Text>
			</Link>
			<Link to="/channel/0/messages">
				<Text>Channel messages</Text>
			</Link>
		</Box>
	);
}
