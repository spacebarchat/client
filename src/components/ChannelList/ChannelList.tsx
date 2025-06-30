import { useAppStore } from "@hooks/useAppStore";
import { ChannelType } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import { AutoSizer, List, ListRowProps } from "react-virtualized";
import styled from "styled-components";
import ChannelListItem from "./ChannelListItem";

const Container = styled.div`
	display: flex;
	flex: 1;
`;

function ChannelList() {
	const app = useAppStore();

	if (!app.activeGuild || !app.activeChannel) return <Container />;
	const guildId = app.activeGuild.id;

	const visibleChannels = app.channels.getVisibleChannelsForGuild(guildId);

	const toggleCategory = (categoryId: string) => {
		app.channels.toggleCategoryCollapse(guildId, categoryId);
	};

	const rowRenderer = ({ index, key, style }: ListRowProps) => {
		const item = visibleChannels[index];
		const active = app.activeChannelId === item.id;
		const isCategory = item.type === ChannelType.GuildCategory;

		return (
			<div style={style}>
				<ChannelListItem
					key={key}
					isCategory={isCategory}
					active={active}
					channel={item}
					isCollapsed={app.channels.isCategoryCollapsed(guildId, item.id)}
					onToggleCollapse={isCategory ? () => toggleCategory(item.id) : undefined}
				/>
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
						rowCount={visibleChannels.length}
						rowHeight={({ index }) => {
							const item = visibleChannels[index];
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
