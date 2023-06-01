import { ChannelType } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import Icon from "./Icon";

const List = styled.div`
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	list-style: none;
	margin: 0;
`;

const ListItem = styled.li<{ isCategory?: boolean }>`
	padding: ${(props) => (props.isCategory ? "16px 8px 0 0" : "1px 8px 0 0")};
	cursor: pointer;
`;
const FirstWrapper = styled.div<{ isCategory?: boolean; active?: boolean }>`
	margin-left: ${(props) => (props.isCategory ? "0" : "8px")};
	height: ${(props) => (props.isCategory ? "28px" : "33px")};
	border-radius: 4px;
	align-items: center;
	display: flex;
	padding: 0 8px;
	background-color: ${(props) =>
		props.active ? "var(--background-primary-alt)" : "transparent"};

	&:hover {
		background-color: var(--background-primary-alt);
	}
`;

const Text = styled.span<{ isCategory?: boolean }>`
	font-size: 16px;
	line-height: 16px;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

function EmptyChannelList() {
	return (
		<List>
			<span>skeleton</span>
		</List>
	);
}

function ChannelList() {
	const app = useAppStore();
	const navigate = useNavigate();
	const { guildId, channelId } = useParams<{
		guildId: string;
		channelId: string;
	}>();
	const guild = app.guilds.get(guildId!);
	if (!guild) return <EmptyChannelList />;

	return (
		<List>
			{guild.channels.mapped.map((channel) => {
				const active = channelId === channel.id;
				const isCategory = channel.type === ChannelType.GuildCategory;
				return (
					<ListItem
						key={channel.id}
						isCategory={isCategory}
						onClick={() =>
							{
								// prevent navigating to non-text channels
								if (!channel.isTextChannel) return;

								navigate(`/channels/${guild.id}/${channel.id}`)
							}
						}
					>
						<FirstWrapper isCategory={isCategory} active={active}>
							{channel.channelIcon && (
								<Icon
									icon={channel.channelIcon}
									size="16px"
									style={{
										marginRight: "8px",
									}}
								/>
							)}
							<Text isCategory={isCategory}>{channel.name}</Text>
						</FirstWrapper>
					</ListItem>
				);
			})}
		</List>
	);
}

export default observer(ChannelList);
