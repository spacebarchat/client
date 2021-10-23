import React, { useRef } from "react";
import { Button, FormControl, Heading, Input, ScrollView, Select, Text, View, VStack, WarningOutlineIcon } from "native-base";
import { Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Styles, { relativeScreenHeight, useMobile } from "../util/Styles";
import KeyboardAvoidingView from "../util/KeyboardAvoidingView";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const styles = StyleSheet.create({
	formInputSection: {
		padding: 10,
	},
});

const Stack = createNativeStackNavigator();

export default function Login() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Test" component={() => <Text>Test</Text>}></Stack.Screen>
			<Stack.Screen
				name="Home"
				component={() => {
					const isMobile = useMobile();

					const emailElement = useRef<any>();
					const passwordElement = useRef<any>();

					return (
						<TouchableWithoutFeedback
							onPress={(e: any) => {
								if (["input", "label"].includes(e.target?.tagName?.toLowerCase())) return;

								Keyboard.dismiss();
							}}
						>
							<KeyboardAvoidingView behavior="padding" style={Styles.h100}>
								<SafeAreaView style={[Styles.h100, { alignItems: "center", display: "flex" }]}>
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
											<FormControl style={styles.formInputSection}>
												<FormControl.Label>Instance</FormControl.Label>
												<Input placeholder="Select an instance" editable={false} focusable={false}></Input>
											</FormControl>
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
										<Button>Login</Button>
									</VStack>
								</SafeAreaView>
							</KeyboardAvoidingView>
						</TouchableWithoutFeedback>
					);
				}}
			/>
		</Stack.Navigator>
	);
}
