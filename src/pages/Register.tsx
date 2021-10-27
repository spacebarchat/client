import React, { useRef } from "react";
import { Image, Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import { useMobile } from "../util/Styles";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";
import { useHistory } from "react-router";
import { tailwind } from "../util/tailwind";
import Checkbox from "../components/Checkbox";
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
	const usernameElement = useRef<any>();
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
				<Text style={tailwind("text-white font-extrabold mt-12 text-4xl")}>Create an account now</Text>
				<Text style={tailwind("text-gray-200 font-light mt-4 text-xl")}>Explore Instances</Text>
				<View style={tailwind("mt-8")}>
					<Text style={tailwind("text-white")}>Email</Text>
					<TextInput
						blurOnSubmit={false}
						onSubmitEditing={() => {
							passwordElement?.current?.focus();
						}}
						returnKeyType="next"
						ref={emailElement}
						textContentType="emailAddress"
						keyboardType="email-address"
						placeholder="Email"
						style={tailwind("bg-gray-200 h-14 rounded-lg")}
					/>
				</View>
				<View style={tailwind("mt-6")}>
					<Text style={tailwind("text-white")}>Username</Text>
					<TextInput ref={usernameElement} placeholder="Username" style={tailwind("bg-gray-200 h-14 rounded-lg")} />
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
				<Checkbox style={tailwind("mt-6")} accessibilityLabel="tosCheckBox" defaultIsChecked>
					<Text style={tailwind("text-white mt-6 ml-2")}>I accept the terms of use of this instance</Text>
				</Checkbox>
				<Button style={tailwind("mt-6 h-16 bg-primary rounded-xl")} onPress={() => history.push("/")}>
					<Text style={tailwind("font-semibold text-lg text-white")}>Register on fosscord.com</Text>
				</Button>
			</KeyboardAvoidingView>
		</>
	);
}
