import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigate } from "react-router";
import Tooltip from "../../components/Tooltip";

export default function Features(props: any) {
	return (
		<SafeAreaView {...props} className="introduction features">
			<ScrollView alwaysBounceVertical={false} bounces={true}>
				<Text className="title">Fosscord</Text>
				<Text className="subtitle">Join the communication revolution</Text>

				<View className="list">
					<View className="feature">
						<Tooltip
							className="wrapper"
							tooltip={<Text className="tooltip">By the public for the public for full transparency</Text>}
						>
							<Text className="image">💻</Text>
							<Text className="name" adjustsFontSizeToFit numberOfLines={1}>
								Free Open Source
							</Text>
						</Tooltip>
					</View>

					<View className="feature">
						<Tooltip className="wrapper" tooltip={<Text className="tooltip">Complete control over your own data</Text>}>
							<Text className="image">🚀</Text>
							<Text className="name" adjustsFontSizeToFit numberOfLines={1}>
								Selfhostable
							</Text>
						</Tooltip>
					</View>
					<View className="feature">
						<Tooltip className="wrapper" tooltip={<Text className="tooltip">Configure everything to your needs</Text>}>
							<Text className="image">⚙️</Text>
							<Text className="name" adjustsFontSizeToFit numberOfLines={1}>
								Configurable
							</Text>
						</Tooltip>
					</View>
					<View className="feature">
						<Tooltip
							className="wrapper"
							tooltip={<Text className="tooltip">Extend the app with custom plugins and themes</Text>}
						>
							<Text className="image">🔧</Text>
							<Text className="name" adjustsFontSizeToFit numberOfLines={1}>
								Extendable
							</Text>
						</Tooltip>
					</View>
					<View className="feature">
						<Tooltip
							className="wrapper"
							tooltip={<Text className="tooltip">Communicate with friends who are using other messengers</Text>}
						>
							<Text className="image">♻️</Text>
							<Text className="name" adjustsFontSizeToFit numberOfLines={1}>
								Compatible
							</Text>
						</Tooltip>
					</View>
					<View className="feature">
						<Tooltip className="wrapper" tooltip={<Text className="tooltip">No single point of failure/moderation</Text>}>
							<Text className="image">🌐</Text>
							<Text className="name" adjustsFontSizeToFit numberOfLines={1}>
								Decentralized
							</Text>
						</Tooltip>
					</View>
					<View className="feature">
						<Tooltip className="wrapper" tooltip={<Text className="tooltip">Analytics are not collected</Text>}>
							<Text className="image">🔇</Text>
							<Text className="name" adjustsFontSizeToFit numberOfLines={1}>
								Privacy
							</Text>
						</Tooltip>
					</View>
					<View className="feature">
						<Tooltip
							className="wrapper"
							tooltip={<Text className="tooltip">End to end encrypted for secure and private conversations</Text>}
						>
							<Text className="image">🔒</Text>
							<Text className="name" adjustsFontSizeToFit numberOfLines={1}>
								Encrypted
							</Text>
						</Tooltip>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
