import React, { useState } from "react";
import { FlatList } from "react-native";
import ChannelStore from "../stores/ChannelStore";
import { DomainContext } from "../stores/DomainStore";
import GuildStore from "../stores/GuildStore";
import ChatMessage from "./ChatMessage";
import Container from "./Container";
import { CommonActions, useNavigation } from "@react-navigation/native";
import ChatInput from "./ChatInput";
import MessageStore from "../stores/MessageStore";
import MessagesStore from "../stores/MessagesStore";
import { observer } from "mobx-react";

interface Props {
	channel: ChannelStore;
	guild: GuildStore;
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
