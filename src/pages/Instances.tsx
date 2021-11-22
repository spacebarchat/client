import React from "react";
import { Text, View } from "react-native";
import Button from "../components/Button";
import discord from "../assets/images/external/discord.svg";
import whatsapp from "../assets/images/external/whatsapp.svg";
import fosscord from "../assets/images/icon/icon.svg";
import { ScrollView } from "react-native-gesture-handler";
import Image from "../components/Image";

export default function Instances() {
	return (
		<View className="page instances">
			<Text className="title">Providers</Text>

			<ScrollView horizontal className="providers">
				<View className="provider">
					<Image source={whatsapp} />
					<Text>WhatsApp</Text>
				</View>
				<View className="provider">
					<Image source={discord} />
					<Text>Discord</Text>
				</View>
			</ScrollView>

			<Text className="title">Instances</Text>
			<ScrollView className="instances">
				<View className="instance">
					<Image source={fosscord} />
					<Text>Fosscord</Text>
				</View>
			</ScrollView>
		</View>
	);
}
