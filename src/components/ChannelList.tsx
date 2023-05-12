import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";

const Wrapper = styled.div`
	display: flex;
	flex: 1 1 auto;
	background-color: var(--background-secondary);
`;

const List = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	border: 0;
	flex: 0 0 240px;
`;

const CategoryListItem = styled.li`
	padding-right: 8px;
`;

const ChannelListItem = styled.li<{ active?: boolean }>`
	cursor: pointer;
	padding: 4px 8px;
	list-style: none;
	border-radius: 4px;
	background-color: ${(props) =>
		props.active ? "var(--background-primary-alt)" : "transparent"};

	&:hover {
		background-color: var(--background-primary-alt);
	}
`;

function EmptyChannelList() {
	return (
		<Wrapper>
			<span>skeleton</span>
		</Wrapper>
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
		<Wrapper>
			<List>
				{guild.channels.mapped.map((cat) => {
					return (
						<CategoryListItem key={cat.id}>
							{cat.category?.name}
							<ul>
								{cat.children.map((channel) => {
									return (
										<ChannelListItem
											key={channel.id}
											active={channelId === channel.id}
										>
											<div
												onClick={() => {
													navigate(
														`/channels/${guildId}/${channel.id}`,
													);
												}}
											>
												{channel.name}
											</div>
										</ChannelListItem>
									);
								})}
							</ul>
						</CategoryListItem>
					);
				})}
			</List>
		</Wrapper>
	);
}

export default observer(ChannelList);
