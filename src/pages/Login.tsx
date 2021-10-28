import React, { useRef } from "react";
import { Image, Keyboard, StyleSheet, Text, View } from "react-native";
import { useMobile } from "../util/Styles";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";
import { useHistory } from "react-router";
import { tailwind } from "../util/tailwind";
import { TextInput } from "react-native-gesture-handler";
import Button from "../components/Button";

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
		history.push("/login/instances/");
	}

	return (
		<>
			<KeyboardAvoidingView behavior="padding" style={tailwind("h-full px-8 py-14")}>
				<Image
					source={{
						uri: "https://github.com/fosscord/fosscord-client/blob/master/ios/fosscord/logo.png?raw=true",
					}}
					style={tailwind("mt-20 w-8 h-8")}
				/>
				<Text style={tailwind("text-white font-extrabold mt-12 text-4xl")}>Hey,{"\n"}Login now!</Text>
				<Text style={tailwind("text-gray-200 font-light mt-4 text-xl")}>Explore Instances</Text>
				<View style={tailwind("mt-14")}>
					<Text>
						<Text style={tailwind("text-white")}>Email</Text>
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
						style={tailwind("bg-gray-200 h-14 rounded-lg")}
					/>
				</View>
				<View style={tailwind("mt-6")}>
					<Text style={tailwind("text-white")}>Password</Text>
					<TextInput
						ref={passwordElement}
						textContentType="password"
						placeholder="Password"
						style={tailwind("bg-gray-200 h-14 rounded-lg")}
					/>
				</View>
				<Text style={tailwind("text-gray-200 font-light mt-4 text-sm opacity-70")}>Forgot your password? </Text>
				<Button onPress={() => history.push("/")} style={tailwind("mt-28 h-16 bg-primary rounded-xl")}>
					<Text style={tailwind("font-semibold text-lg text-white")}>Login to fosscord.com</Text>
				</Button>
			</KeyboardAvoidingView>
		</>
	);
}
