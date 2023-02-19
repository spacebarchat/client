import { CommonActions, useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import { FlatList } from "react-native";
import Channel from "../stores/Channel";
import { DomainContext } from "../stores/DomainStore";
import Guild from "../stores/Guild";
import ChatInput from "./ChatInput/ChatInput";
import ChatMessage from "./ChatMessage";
import Container from "./Container";

interface Props {
	channel: Channel;
	guild: Guild;
}

const MessageList = observer(({ channel }: Props) => {
	const domain = React.useContext(DomainContext);
	const navigation = useNavigation();

	React.useEffect(() => {
		navigation.dispatch(CommonActions.setParams({ channelId: channel.id }));

		channel.getChannelMessages(domain, 50).catch(console.error);
	}, [channel]);

	return (
		<Container testID="chatContent" displayFlex flexOne>
			<FlatList
				data={channel.messages.asList().reverse()}
				renderItem={({ item }) => <ChatMessage message={item} />}
				keyExtractor={(item) => item.id}
				inverted={true}
			/>
			<ChatInput channel={channel} />
		</Container>
	);
});

export default MessageList;
