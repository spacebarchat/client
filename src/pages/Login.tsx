import React, { useRef } from "react";
import { Image, Keyboard, StyleSheet, Text, View } from "react-native";
import { useMobile } from "../util/Styles";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";
import { useNavigate } from "react-router";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Button from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
	formInputSection: {
		padding: 10,
	},
});

export default function Login() {
	const navigate = useNavigate();

	const isMobile = useMobile();

	const emailElement = useRef<any>();
	const passwordElement = useRef<any>();

	function openModal() {
		Keyboard.dismiss();
		navigate("/login/instances/");
	}

	return (
		<ScrollView className="login h-100">
			<SafeAreaView>
				<Image
					source={{
						uri: "https://github.com/fosscord/fosscord-client/blob/master/ios/fosscord/logo.png?raw=true",
					}}
				/>
				<Text>Hey,{"\n"}Login now!</Text>
				<Text>Explore Instances</Text>
				<View>
					<Text>
						<Text>Email</Text>
					</Text>
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
				<View>
					<Text>Password</Text>
					<TextInput ref={passwordElement} textContentType="password" placeholder="Password" />
				</View>
				<Text>Forgot your password? </Text>
				<Button onPress={() => navigate("/")}>
					<Text>Login to fosscord.com</Text>
				</Button>
			</SafeAreaView>
		</ScrollView>
	);
}
