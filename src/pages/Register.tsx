import React, { useRef, useState } from "react";
import { Keyboard, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMobile } from "../util/Styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigate } from "react-router";
import Checkbox from "../components/Checkbox";
import Button from "../components/Button";
import Icon from "../assets/images/icon/1024.png";
import Image from "../components/Image";
import Input from "../components/Input";
import { SafeAreaView } from "react-native-safe-area-context";
import useSafeAreaStyle from "../util/useSafeAreaStyle";

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
		<View className="register">
			<View style={useSafeAreaStyle()}>
				<KeyboardAwareScrollView bounces={false}>
					<Image className="" style={{ width: 32, height: 32, position: "relative", opacity: 1 }} source={Icon} />
					<Text className="title">Create an account now</Text>
					<Text className="heading">Explore Instances</Text>
					<View className="">
						<Text className="text-accent">Email</Text>
						<Input
							blurOnSubmit={false}
							onSubmitEditing={() => {
								usernameElement?.current?.focus();
							}}
							returnKeyType="next"
							ref={emailElement}
							textContentType="emailAddress"
							keyboardType="email-address"
							placeholder="Email"
						/>
					</View>
					<View className="">
						<Text className="text-accent">Username</Text>
						<Input
							blurOnSubmit={false}
							onSubmitEditing={() => {
								passwordElement?.current?.focus();
							}}
							returnKeyType="next"
							ref={usernameElement}
							placeholder="Username"
						/>
					</View>
					<View className="">
						<Text className="text-accent">Password</Text>
						<Input ref={passwordElement} textContentType="password" placeholder="Password" />
					</View>
					<Checkbox className="" accessibilityLabel="tosCheckBox" defaultIsChecked>
						<Text>I accept the terms of use of this instance</Text>
					</Checkbox>
					<Button className="" onPress={() => navigate("/")}>
						Register on fosscord.com
					</Button>
				</KeyboardAwareScrollView>
			</View>
		</View>
	);
}
