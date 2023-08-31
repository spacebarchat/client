import { ChannelType } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import Guild from "../stores/objects/Guild";
import ChannelListItem from "./ChannelListItem";

const List = styled.div`
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	list-style: none;
	margin: 0;
`;

function EmptyChannelList() {
	return (
		<List>
			<span>skeleton</span>
		</List>
	);
}

interface Props {
	channelId?: string;
	guild?: Guild;
}

function ChannelList({ guild, channelId }: Props) {
	if (!guild) return <EmptyChannelList />;

	return (
		<List>
			{guild.channels.mapped.map((channel) => {
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
			})}
		</List>
	);
}

export default observer(ChannelList);
