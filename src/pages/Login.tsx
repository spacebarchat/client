import React, { useRef } from "react";
import { Box, Button, FormControl, Input, Text, View, VStack, Heading, Image } from "native-base";
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Styles, { relativeScreenHeight, useMobile } from "../util/Styles";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";
import { useHistory } from "react-router";
import { tailwind } from "../util/tailwind";

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
			<KeyboardAvoidingView behavior='padding' style={tailwind("h-full px-8 py-14")}>
				<Image
					source={{
						uri: "https://github.com/fosscord/fosscord-client/blob/master/ios/fosscord/logo.png?raw=true",
					}}
					alt='Alternate Text'
					style={tailwind("mt-20 w-8 h-8")}
				/>
				<Heading style={tailwind("text-white font-extrabold mt-12 text-4xl")}>Hey,{"\n"}Login now!</Heading>
				<Heading style={tailwind("text-gray-200 font-light mt-4 text-xl")}>Explore Instances</Heading>
				<FormControl style={tailwind("mt-14")}>
					<FormControl.Label>
						<Text style={tailwind("text-white")}>Email</Text>
					</FormControl.Label>
					<Input
						blurOnSubmit={false}
						onSubmitEditing={() => {
							passwordElement?.current?.focus();
						}}
						returnKeyType='next'
						ref={emailElement}
						type='email'
						placeholder='Email'
						style={tailwind("bg-gray-200 h-14 rounded-lg")}
					/>
				</FormControl>
				<FormControl style={tailwind("mt-6")}>
					<FormControl.Label>
						<Text style={tailwind("text-white")}>Password</Text>
					</FormControl.Label>
					<Input ref={passwordElement} type='password' placeholder='Password' style={tailwind("bg-gray-200 h-14 rounded-lg")} />
				</FormControl>
				<Heading style={tailwind("text-gray-200 font-light mt-4 text-sm opacity-70")}>Forgot your password? </Heading>
				<Button style={tailwind("mt-28 h-16 bg-primary rounded-xl")} onPress={() => history.push("/")}>
					<Text style={tailwind("font-semibold text-lg text-white")}>Login to fosscord.com</Text>
				</Button>
			</KeyboardAvoidingView>
		</>
	);
}
