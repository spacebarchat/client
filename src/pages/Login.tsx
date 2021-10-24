import React, { useRef } from "react";
import { Box, Button, FormControl, Input, Text, View, VStack } from "native-base";
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Styles, { relativeScreenHeight, useMobile } from "../util/Styles";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";
import { useHistory } from "react-router";

const styles = StyleSheet.create({
	formInputSection: {
		padding: 10,
	},
});

export default function Login() {
	const history = useHistory();

	const isMobile = useMobile();

	const emailElement = useRef<any>();
	const passwordElement = useRef<any>();

	function openModal() {
		Keyboard.dismiss();
		history.push("/instances/");
	}

	return (
		<>
			<KeyboardAvoidingView behavior="padding" style={Styles.h100}>
				<Box safeArea style={[Styles.h100, { alignItems: "center", display: "flex" }]}>
					<VStack
						rounded={5}
						style={{ width: "100%", maxWidth: 480, height: isMobile ? "100%" : undefined }}
						top={isMobile ? 0 : relativeScreenHeight(10)}
						justifyContent="space-between"
						display="flex"
						borderWidth={isMobile ? 0 : "1"}
						borderColor="text"
						p="5"
					>
						<View>
							<TouchableWithoutFeedback onPress={openModal}>
								<FormControl
									// @ts-ignore
									style={[styles.formInputSection, { outline: "none" }]}
								>
									<FormControl.Label>Instance</FormControl.Label>
									<Box
										width="100%"
										height={10}
										borderWidth="1"
										borderColor="text"
										padding={3}
										borderRadius="5"
										display="flex"
										justifyContent="center"
									>
										<Text fontSize={15} color="#a3a3a3">
											Select an instance
										</Text>
									</Box>
								</FormControl>
							</TouchableWithoutFeedback>
							<FormControl style={styles.formInputSection}>
								<FormControl.Label>Email</FormControl.Label>
								<Input
									blurOnSubmit={false}
									onSubmitEditing={() => {
										passwordElement?.current?.focus();
									}}
									returnKeyType="next"
									ref={emailElement}
									type="email"
									placeholder="Enter email"
								/>
							</FormControl>
							<FormControl style={styles.formInputSection}>
								<FormControl.Label>Password</FormControl.Label>
								<Input ref={passwordElement} type="password" placeholder="Enter password" />
							</FormControl>
						</View>
						<Button style={{ margin: 10 }}>Login</Button>
					</VStack>
				</Box>
			</KeyboardAvoidingView>
		</>
	);
}
