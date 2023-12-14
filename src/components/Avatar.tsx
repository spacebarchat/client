import { PresenceUpdateStatus } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import AccountStore from "../stores/AccountStore";
import { useAppStore } from "../stores/AppStore";
import Presence from "../stores/objects/Presence";
import User from "../stores/objects/User";
import Container from "./Container";
import Floating from "./floating/Floating";
import FloatingTrigger from "./floating/FloatingTrigger";

const Wrapper = styled(Container)<{ size: number; hasClick?: boolean }>`
	width: ${(props) => props.size}px;
	height: ${(props) => props.size}px;
	position: relative;
	background-color: transparent;

	&:hover {
		text-decoration: underline;
		cursor: ${(props) => (props.hasClick ? "pointer" : "default")};
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

function Yes(onClick: React.MouseEventHandler<HTMLDivElement>) {
	return ({ children }: { children: React.ReactNode }) => {
		return <div onClick={onClick}>{children}</div>;
	};
}

interface Props {
	user?: User | AccountStore;
	size?: number;
	style?: React.CSSProperties;
	onClick?: React.MouseEventHandler<HTMLDivElement> | null;
	popoutPlacement?: "left" | "right" | "top" | "bottom";
	presence?: Presence;
	statusDotStyle?: {
		width?: number;
		height?: number;
	};
	showPresence?: boolean;
}

function Avatar(props: Props) {
	const app = useAppStore();

	const ref = React.useRef<HTMLDivElement>(null);

	const user = props.user ?? app.account;
	if (!user) return null;

	const Base = props.onClick ? Yes(props.onClick) : FloatingTrigger;

	return (
		<Floating
			placement="right-start"
			type="userPopout"
			props={{
				user: user as unknown as User,
			}}
		>
			<Base>
				<Wrapper size={props.size ?? 32} style={props.style} ref={ref} hasClick={props.onClick !== null}>
					<img
						style={{
							borderRadius: "50%",
						}}
						src={user.avatarUrl}
						width={props.size ?? 32}
						height={props.size ?? 32}
						loading="eager"
					/>
					{props.showPresence && (
						<StatusDot
							color={app.theme.getStatusColor(props.presence?.status ?? PresenceUpdateStatus.Offline)}
							{...props.statusDotStyle}
						/>
					)}
				</Wrapper>
			</Base>
		</Floating>
	);
}

export default observer(Avatar);
