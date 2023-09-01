import { ChannelType } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import Channel from "../stores/objects/Channel";
import Guild from "../stores/objects/Guild";
import { Permissions } from "../utils/Permissions";
import ChannelListItem from "./ChannelListItem";

const List = styled.div`
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	list-style: none;
	margin: 0;
`;

function EmptyChannelList() {
	return <List></List>;
}

interface Props {
	channelId?: string;
	guild?: Guild;
}

function ChannelList({ channelId, guild }: Props) {
	const app = useAppStore();

	const renderChannelListItem = React.useCallback(
		(channel: Channel) => {
			if (!guild) return null;
			const permission = Permissions.getPermission(app.account!.id, guild, channel);
			if (!permission.has("VIEW_CHANNEL")) return null;

			const active = channelId === channel.id;
			const isCategory = channel.type === ChannelType.GuildCategory;
			return (
				<ChannelListItem
					key={channel.id}
					guild={guild}
					channel={channel}
					isCategory={isCategory}
					active={active}
				/>
			);
		},
		[app.account, channelId, guild],
	);

	if (!guild) return <EmptyChannelList />;

	return <List>{guild.channels.mapped.map((channel) => renderChannelListItem(channel))}</List>;
}

export default observer(ChannelList);
