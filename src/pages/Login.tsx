import React, { useRef } from "react";
import { Image, Keyboard, Pressable, ScrollView, StyleSheet, Text, View, TextInput as I } from "react-native";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { useMobile } from "../util/Styles";

export default function Login() {
	const navigate = useNavigate();

	const emailElement = useRef<any>();
	const passwordElement = useRef<any>();
	const isMobile = useMobile();

	function openModal() {
		Keyboard.dismiss();
		navigate("/login/instances/");
	}

	return (
		<ScrollView
			keyboardShouldPersistTaps="always"
			alwaysBounceVertical={false}
			style={{ height: "100%" }}
			contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20, display: "flex", alignItems: "center", height: "100%" }}
		>
			<KeyboardAvoidingView safeArea behavior="padding" className="page login" style={{ maxWidth: 460, flex: 1 }}>
				<Text className="title">Login</Text>
				<View style={{ paddingVertical: 10 }}>
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
				<View style={{ paddingVertical: 10 }}>
					<Text className="label">Password</Text>
					<TextInput ref={passwordElement} secureTextEntry textContentType="password" placeholder="Password" />
				</View>
				<Pressable style={{ marginBottom: 10 }} onPress={() => navigate("/resetPassword")} className="forgot-password">
					<Text className="muted">Reset password</Text>
				</Pressable>
				<View style={{ paddingVertical: 10, flexGrow: isMobile ? 1 : 0, display: "flex", justifyContent: "flex-end" }}>
					<Button style={{ margin: 0 }} onPress={() => navigate("/")}>
						<Text>Login to fosscord.com</Text>
					</Button>
				</View>
			</KeyboardAvoidingView>
		</ScrollView>
	);
}
