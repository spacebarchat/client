import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { ContextMenuContext } from "../contexts/ContextMenuContext";
import { useAppStore } from "../stores/AppStore";
import User from "../stores/objects/User";
import ContextMenus from "../utils/ContextMenus";
import Container from "./Container";

const Wrapper = styled(Container)<{ size: number }>`
	width: ${(props) => props.size}px;
	height: ${(props) => props.size}px;
	border-radius: 50%;
	position: relative;

	&:hover {
		text-decoration: underline;
		cursor: pointer;
	}
`;

interface Props {
	user?: User;
	size?: number;
	style?: React.CSSProperties;
}

function Avatar(props: Props) {
	const app = useAppStore();
	const contextMenu = React.useContext(ContextMenuContext);
	const user = props.user ?? app.account;
	if (!user) return null;

	return (
		<Wrapper
			size={props.size ?? 32}
			style={props.style}
			onContextMenu={(e) => contextMenu.open2(e, [ContextMenus.User(user)])}
		>
			<img src={user.avatarUrl} width={props.size ?? 32} height={props.size ?? 32} loading="eager" />
		</Wrapper>
	);
}

export default observer(Avatar);
