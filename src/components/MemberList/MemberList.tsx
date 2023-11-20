import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { useAppStore } from "../../stores/AppStore";
import GuildMemberListStore from "../../stores/GuildMemberListStore";
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
	const [list, setList] = React.useState<null | GuildMemberListStore["list"]>(null);

	React.useEffect(
		() =>
			autorun(() => {
				if (app.activeGuild && app.activeChannel) {
					const { memberLists } = app.activeGuild;
					const listId = app.activeChannel.listId;
					const store = memberLists.get(listId);
					setList(store ? store.list : null);
				} else {
					setList(null);
				}
			}),
		[],
	);

	return (
		<Container>
			<List>
				{list
					? list.map((category, i) => (
							<ListSection
								key={i}
								name={category.name}
								items={
									category.items.map((x) => x.nick ?? x.user?.username).filter((x) => x) as string[]
								}
							/>
					  ))
					: null}
			</List>
		</Container>
	);
}

export default observer(MemberList);
