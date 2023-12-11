import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import Icon, { IconProps } from "./Icon";
import { SectionHeader } from "./SectionHeader";

const Wrapper = styled(SectionHeader)`
	background-color: var(--background-secondary);
	cursor: pointer;

	&:hover {
		background-color: var(--background-secondary-highlight);
	}
`;

const HeaderText = styled.header`
	font-size: 16px;
	font-weight: var(--font-weight-medium);
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	user-select: none;
`;

function ChannelHeader() {
	const app = useAppStore();

	const [icon, setIcon] = React.useState<IconProps["icon"]>("mdiChevronDown");

	function openMenu(e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation();

		setIcon("mdiClose");
	}

	if (app.activeGuildId === "@me") {
		return (
			<Wrapper
				style={{
					cursor: "default",
					pointerEvents: "none",
					display: "flex",
					justifyContent: "center",
				}}
			>
				<HeaderText>Direct Messages</HeaderText>
			</Wrapper>
		);
	}

	if (!app.activeGuild) return null;

	return (
		<Wrapper onClick={openMenu}>
			<HeaderText>{app.activeGuild.name}</HeaderText>
			<Icon icon={icon} size="20px" color="var(--text)" />
		</Wrapper>
	);
}

export default observer(ChannelHeader);
