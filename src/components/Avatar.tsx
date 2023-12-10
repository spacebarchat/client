import { PresenceUpdateStatus } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { PopoutContext } from "../contexts/PopoutContext";
import AccountStore from "../stores/AccountStore";
import { useAppStore } from "../stores/AppStore";
import Presence from "../stores/objects/Presence";
import User from "../stores/objects/User";
import Container from "./Container";
import UserProfilePopout from "./UserProfilePopout";

const Wrapper = styled(Container)<{ size: number }>`
	width: ${(props) => props.size}px;
	height: ${(props) => props.size}px;
	position: relative;
	background-color: transparent;

	&:hover {
		text-decoration: underline;
		cursor: pointer;
	}
`;

const StatusDot = styled.span<{ color: string; width?: number; height?: number }>`
	position: absolute;
	bottom: 0;
	right: 0;
	background-color: ${(props) => props.color};
	border-radius: 50%;
	border: 2px solid var(--background-primary);
	width: ${(props) => props.width ?? 10}px;
	height: ${(props) => props.height ?? 10}px;
`;

interface Props {
	user?: User | AccountStore;
	size?: number;
	style?: React.CSSProperties;
	onClick?: (() => void) | null;
	popoutPlacement?: "left" | "right" | "top" | "bottom";
	presence?: Presence;
	statusDotStyle?: {
		width?: number;
		height?: number;
	};
}

function Avatar(props: Props) {
	const app = useAppStore();

	const popoutContext = React.useContext(PopoutContext);
	const ref = React.useRef<HTMLDivElement>(null);

	const user = props.user ?? app.account;
	if (!user) return null;

	const openPopout = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!ref.current) return;

		const rect = ref.current.getBoundingClientRect();
		if (!rect) return;

		popoutContext.open({
			element: <UserProfilePopout user={user} presence={props.presence} />,
			position: rect,
			placement: props.popoutPlacement,
		});
	};

	const clickProp = props.onClick === null ? {} : { onClick: props.onClick ?? openPopout };

	return (
		<Wrapper size={props.size ?? 32} style={props.style} ref={ref} {...clickProp}>
			<img
				style={{
					borderRadius: "50%",
				}}
				src={user.avatarUrl}
				width={props.size ?? 32}
				height={props.size ?? 32}
				loading="eager"
			/>
			{props.presence && props.presence.status !== PresenceUpdateStatus.Offline && (
				<StatusDot color={app.theme.getStatusColor(props.presence.status)} {...props.statusDotStyle} />
			)}
		</Wrapper>
	);
}

export default observer(Avatar);
