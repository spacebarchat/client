import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { useAppStore } from "../../stores/AppStore";
import ListSection from "../ListSection";

const Container = styled.div`
	display: flex;
	flex: 0 0 240px;
	flex-direction: column;
	background-color: var(--background-secondary);
	height: 100%;

	@media (max-width: 1050px) {
		display: none;
	}
`;

const Wrapper = styled.aside`
	justify-content: center;
	min-width: 240px;
	max-height: 100%;
	display: flex;
`;

const List = styled.ul`
	padding: 0;
	margin: 0;
	list-style: none;
	overflow-y: auto;
	height: 100%;
	width: 100%;
`;

function MemberList() {
	const app = useAppStore();

	if (!app.activeGuild || !app.activeChannel) return null;
	const { memberList } = app.activeGuild;

	return (
		<Container>
			{/* <AutoSizer>
				{({ width, height }) => (
					<List
						height={height}
						overscanRowCount={2}
						rowCount={memberList.length}
						rowHeight={({ index }) => {
							// const item = channels[index];
							// if (item.type === ChannelType.GuildCategory) {
							// 	return 44;
							// }
							return 33;
						}}
						rowRenderer={rowRenderer}
						width={width}
					/>
				)}
			</AutoSizer> */}

			<List>
				{memberList.map((category) => (
					<ListSection
						name={category.name}
						items={category.items.map((x) => x.nick ?? x.user?.username).filter((x) => x) as string[]}
					/>
				))}
			</List>
		</Container>
	);
}

export default observer(MemberList);
