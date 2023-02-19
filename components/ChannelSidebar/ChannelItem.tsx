import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { CustomTheme } from "../../constants/Colors";
import Channel from "../../stores/Channel";
import Container from "../Container";

interface Props {
	channel: Channel;
}

function ChannelItem({ channel }: Props) {
	const navigation = useNavigation();
	const theme = useTheme<CustomTheme>();
	const [style, setStyle] = React.useState<StyleProp<ViewStyle>>({});

	const onHoverIn = () =>
		setStyle({ backgroundColor: theme.colors.palette.backgroundPrimary90 });

	const onHoverOut = () => setStyle({ backgroundColor: undefined });

	const onPress = () => {
		navigation.navigate("Channels", {
			screen: "Channel",
			params: {
				guildId: channel.guild_id!,
				channelId: channel.id,
			},
		});
	};

	return (
		<Container
			row
			horizontalCenter
			style={[{ marginLeft: 10, padding: 5, borderRadius: 5 }, style]}
			element={Pressable}
			onHoverIn={onHoverIn}
			onHoverOut={onHoverOut}
			onPress={onPress}
		>
			{channel.channelIcon && (
				<MaterialCommunityIcons
					name={channel.channelIcon! as any}
					size={16}
					color={theme.colors.textMuted}
					style={{ marginRight: 5 }}
				/>
			)}
			<Text
				style={{
					color: theme.colors.textMuted,
				}}
			>
				{channel.name}
			</Text>
		</Container>
	);
}

export default ChannelItem;
