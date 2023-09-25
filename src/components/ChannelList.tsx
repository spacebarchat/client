import { ChannelType } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import { AutoSizer, List, ListRowProps } from "react-virtualized";
import { useAppStore } from "../stores/AppStore";
import ChannelListItem from "./ChannelListItem";

export function EmptyChannelList() {
	return <div></div>;
}

function ChannelList() {
	const app = useAppStore();

	if (!app.activeGuild || !app.activeChannel) return null;
	const { channelsSorted } = app.activeGuild;

	const rowRenderer = ({ index, key, style }: ListRowProps) => {
		const item = channelsSorted[index];

		const active = app.activeChannelId === item.id;
		const isCategory = item.type === ChannelType.GuildCategory;
		return (
			<div style={style}>
				<ChannelListItem key={key} isCategory={isCategory} active={active} channel={item} />
			</div>
		);
	};

	return (
		<div
			style={{
				flex: "1 0 auto",
				display: "flex",
			}}
		>
			<AutoSizer>
				{({ width, height }) => (
					<List
						height={height}
						overscanRowCount={2}
						rowCount={channelsSorted.length}
						rowHeight={({ index }) => {
							const item = channelsSorted[index];
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
		</div>
	);
}

export default observer(ChannelList);
