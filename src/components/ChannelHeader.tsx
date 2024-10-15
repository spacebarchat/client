import { Floating, FloatingTrigger } from "@components/floating";
import { useAppStore } from "@hooks/useAppStore";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import styled from "styled-components";
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

	const [isOpen, setOpen] = React.useState(false);
	const [icon, setIcon] = React.useState<IconProps["icon"]>("mdiChevronDown");

	const onOpenChange = (open: boolean) => {
		setOpen(open);
	};

	useEffect(() => {
		if (isOpen) setIcon("mdiClose");
		else setIcon("mdiChevronDown");
	}, [isOpen]);

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
		<Floating type="guild" open={isOpen} onOpenChange={onOpenChange} props={{ guild: app.activeGuild! }}>
			<FloatingTrigger>
				<Wrapper>
					<HeaderText>{app.activeGuild.name}</HeaderText>
					<Icon icon={icon} size="20px" color="var(--text)" />
				</Wrapper>
			</FloatingTrigger>
		</Floating>
	);
}

export default observer(ChannelHeader);
