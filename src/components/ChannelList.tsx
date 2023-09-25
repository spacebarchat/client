import { ChannelType } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import { AutoSizer, List, ListRowProps } from "react-virtualized";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import ChannelListItem from "./ChannelListItem";

const Container = styled.div`
	display: flex;
	flex: 1;
`;

export function EmptyChannelList() {
	return <Container></Container>;
}

function ChannelList() {
	const app = useAppStore();

	if (!app.activeGuild || !app.activeChannel) return null;
	const { channels } = app.activeGuild;

	const rowRenderer = ({ index, key, style }: ListRowProps) => {
		const item = channels[index];

		const active = app.activeChannelId === item.id;
		const isCategory = item.type === ChannelType.GuildCategory;
		return (
			<div style={style}>
				<ChannelListItem key={key} isCategory={isCategory} active={active} channel={item} />
			</div>
		);
	};

	return (
		<Container>
			<AutoSizer>
				{({ width, height }) => (
					<List
						height={height}
						overscanRowCount={2}
						rowCount={channels.length}
						rowHeight={({ index }) => {
							const item = channels[index];
							if (item.type === ChannelType.GuildCategory) {
								return 44;
							}
							return 33;
						}}
						rowRenderer={rowRenderer}
						width={width}
					/>
				)}
			</AutoSizer>
		</Container>
	);
}

export default observer(ChannelList);
