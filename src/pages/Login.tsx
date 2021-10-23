import { Button, FormControl, Heading, Input, View, WarningOutlineIcon } from "native-base";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Styles from "../util/Styles";

const styles = StyleSheet.create({
	formInputSection: {
		padding: 10,
	},
});

export default function Login() {
	return (
		<SafeAreaView style={Styles.h100}>
			<View style={[Styles.h100, Styles.flex]}>
				<View rounded={5} width="50%" display="flex" borderWidth="1" borderColor="text" p="5">
					<FormControl style={styles.formInputSection}>
						<FormControl.Label>Username/Email</FormControl.Label>
						<Input type="email" placeholder="Enter Username or email" />
					</FormControl>
					<FormControl style={styles.formInputSection}>
						<FormControl.Label>Password</FormControl.Label>
						<Input type="password" placeholder="Enter password" />
					</FormControl>
					<Button style={styles.formInputSection}>Login</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}
