import { observer } from "mobx-react";
import React from "react";
import { Text } from "react-native-paper";
import Container from "../../../components/Container";

function Settings() {
	return (
		<Container>
			<Text>Settings</Text>
		</Container>
	);
}

export default observer(Settings);
