import { RESTPostAPIChannelMessageJSONBody } from "@puyodead1/fosscord-api-types/v9";
import { observer } from "mobx-react";
import React from "react";
import { TextInput } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { CustomTheme } from "../../constants/Colors";
import Channel from "../../stores/Channel";
import { DomainContext } from "../../stores/DomainStore";
import { Routes } from "../../utils/Endpoints";
import Container from "../Container";

interface Props {
	channel: Channel;
}

function ChatInput({ channel }: Props) {
	const [message, setMessage] = React.useState("");
	const domain = React.useContext(DomainContext);
	const theme = useTheme<CustomTheme>();

	const postMessage = (message: string, channel_id: string) => {
		// check if the message is empty, contains only spaces, or contains only newlines
		if (!message || !message.trim() || !message.replace(/\r?\n|\r/g, ""))
			return;
		domain.rest.post<RESTPostAPIChannelMessageJSONBody, any>(
			Routes.channelMessages(channel_id),
			{
				content: message,
				nonce: Date.now().toString(),
			},
		);
	};

	return (
		<Container
			testID="chatInput"
			style={{
				padding: 10,
			}}
		>
			<Container
				row
				horizontalCenter
				style={{
					backgroundColor: theme.colors.palette.backgroundPrimary60,
					borderRadius: 20,
				}}
			>
				<TextInput
					placeholder={`Message #${channel?.name}`}
					value={message}
					onChangeText={(message) => setMessage(message)}
					editable
					multiline
					style={{
						backgroundColor: "transparent",
						color: theme.colors.whiteBlack,
						padding: 10,
						flex: 1,
					}}
					placeholderTextColor={theme.colors.text}
					spellCheck={false}
				/>
				<IconButton
					icon="send"
					size={32}
					onPress={(e) => {
						postMessage(message, channel.id);
						setMessage("");
					}}
				/>
			</Container>
		</Container>
	);
}

export default observer(ChatInput);
