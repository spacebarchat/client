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
	background-color: transparent;
	display: flex;
	flex-direction: column;
`;

const StatusDot = styled.i<{ color: string; size?: number; left?: number; bottom?: number }>`
	border-radius: 50%;
	border: 0.3rem solid var(--background-secondary);
	background-color: ${(props) => props.color};
	height: ${(props) => props.size ?? 16}px;
	width: ${(props) => props.size ?? 16}px;
	position: relative;
	bottom: ${(props) => props.bottom ?? 16}px;
	left: ${(props) => props.left ?? 20}px;
	display: block;
`;

const InnerWrapper = styled.div<{ width?: number; height?: number }>`
	height: ${(props) => props.height ?? 40}px;
	width: ${(props) => props.width ?? 40}px;
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
		size?: number;
		left?: number;
		bottom?: number;
	};
	showPresence?: boolean;
	innerWrapperSize?: number;
}

function Avatar(props: Props) {
	const app = useAppStore();

	const ref = React.useRef<HTMLDivElement>(null);

	const user = props.user ?? app.account;
	if (!user) return null;

	// if onClick is null, use a div. if we pass a function, use yes. otherwise use FloatingTrigger
	const Base = props.onClick === null ? "div" : props.onClick ? Yes(props.onClick) : FloatingTrigger;

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
					<InnerWrapper width={props.innerWrapperSize} height={props.innerWrapperSize}>
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
					</InnerWrapper>
				</Wrapper>
			</Base>
		</Floating>
	);
}

export default observer(Avatar);
