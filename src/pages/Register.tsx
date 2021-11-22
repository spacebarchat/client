import React, { useRef, useState } from "react";
import { Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigate } from "react-router";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import Icon from "../assets/images/icon/1024.png";
import Image from "../components/Image";
import Input from "../components/Input";
import { SafeAreaView } from "react-native-safe-area-context";
import useSafeAreaStyle from "../util/useSafeAreaStyle";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";
import TextInput from "../components/TextInput";

const styles = StyleSheet.create({
	formInputSection: {
		padding: 10,
	},
});

export default function Login() {
	const navigate = useNavigate();

	const emailElement = useRef<any>();
	const usernameElement = useRef<any>();
	const passwordElement = useRef<any>();

	function openModal() {
		Keyboard.dismiss();
		navigate("/login/instances/");
	}

	return (
		<ScrollView
			keyboardShouldPersistTaps="always"
			alwaysBounceVertical={false}
			style={{ height: "100%", paddingHorizontal: 15, flex: 1, paddingBottom: 20 }}
		>
			<KeyboardAvoidingView scrollView safeArea behavior="padding" className="page register">
				<Text className="title">Register</Text>
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
						<Text>Register on fosscord.com</Text>
					</Button>
				</View>
			</KeyboardAvoidingView>
		</ScrollView>
	);
}
