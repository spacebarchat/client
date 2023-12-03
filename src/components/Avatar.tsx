import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { PopoutContext } from "../contexts/PopoutContext";
import AccountStore from "../stores/AccountStore";
import { useAppStore } from "../stores/AppStore";
import User from "../stores/objects/User";
import Container from "./Container";
import UserProfilePopout from "./UserProfilePopout";

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
	user?: User | AccountStore;
	size?: number;
	style?: React.CSSProperties;
	onClick?: () => void;
	popoutPlacement?: "left" | "right" | "top" | "bottom";
}

function Avatar(props: Props) {
	const app = useAppStore();

	const popoutContext = React.useContext(PopoutContext);
	const ref = React.useRef<HTMLDivElement>(null);

	const user = props.user ?? app.account;
	if (!user) return null;

	const openPopout = () => {
		if (!ref.current) return;

		const rect = ref.current.getBoundingClientRect();
		if (!rect) return;

		popoutContext.open({
			element: <UserProfilePopout user={user} />,
			position: rect,
			placement: props.popoutPlacement,
		});
	};

	return (
		<Wrapper
			size={props.size ?? 32}
			style={props.style}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				props.onClick ? props.onClick() : openPopout();
			}}
			ref={ref}
		>
			<img src={user.avatarUrl} width={props.size ?? 32} height={props.size ?? 32} loading="eager" />
		</Wrapper>
	);
}

export default observer(Avatar);
