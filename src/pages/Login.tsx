import React, { useRef } from "react";
import { Image, Keyboard, Pressable, ScrollView, StyleSheet, Text, View, TextInput as I } from "react-native";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

const styles = StyleSheet.create({
	formInputSection: {
		padding: 10,
	},
});

export default function Login() {
	const navigate = useNavigate();

	const emailElement = useRef<any>();
	const passwordElement = useRef<any>();

	function openModal() {
		Keyboard.dismiss();
		navigate("/login/instances/");
	}

	console.log("rerender login");

	return (
		<ScrollView
			keyboardShouldPersistTaps="always"
			alwaysBounceVertical={false}
			style={{ height: "100%", paddingHorizontal: 15, flex: 1, paddingBottom: 20 }}
		>
			<KeyboardAvoidingView scrollView safeArea behavior="padding" className="page login">
				<Text className="title">Login</Text>
				<View className="entry">
					<Text className="label">Email</Text>
					<TextInput
						blurOnSubmit={false}
						onSubmitEditing={() => {
							passwordElement?.current?.focus();
						}}
						returnKeyType="next"
						ref={emailElement}
						keyboardType="email-address"
						textContentType="emailAddress"
						placeholder="Email"
					/>
				</View>
				<View className="entry">
					<Text className="label">Password</Text>
					<TextInput ref={passwordElement} secureTextEntry textContentType="password" placeholder="Password" />
				</View>
				<Pressable onPress={() => navigate("/resetPassword")} className="forgot-password">
					<Text className="muted">Reset password</Text>
				</Pressable>
				<View className="entry submit">
					<Button onPress={() => navigate("/")}>
						<Text>Login to fosscord.com</Text>
					</Button>
				</View>
			</KeyboardAvoidingView>
		</ScrollView>
	);
}
