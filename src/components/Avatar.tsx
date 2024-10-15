import { PresenceUpdateStatus } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import React, { useRef } from "react";
import styled from "styled-components";
import { useAppStore } from "../hooks/useAppStore";
import AccountStore from "../stores/AccountStore";
import Presence from "../stores/objects/Presence";
import User from "../stores/objects/User";
import Container from "./Container";

const Wrapper = styled(Container)<{ size: number; hasClick?: boolean }>`
	background-color: transparent;
	display: flex;
	flex-direction: column;
	user-select: none;
`;

interface Props {
	user?: User | AccountStore;
	size: 32 | 80;
	style?: React.CSSProperties;
	onClick?: React.MouseEventHandler<HTMLDivElement> | null;
	popoutPlacement?: "left" | "right" | "top" | "bottom";
	presence?: Presence;
	statusDotStyle?: {
		size?: number;
		borderThickness?: number;
	};
	showPresence?: boolean;
	isFloating?: boolean;
}

function Avatar(props: Props) {
	const app = useAppStore();

	const ref = useRef<HTMLDivElement>(null);

	const user = props.user ?? app.account;
	if (!user) return null;

	const presenceRingsTreatment = app.experiments.getTreatment("presence_rings");
	const ringsEnabled = presenceRingsTreatment && presenceRingsTreatment.id === 2;

	const children = (
		<Wrapper size={props.size} style={props.style} ref={ref} hasClick={props.onClick !== null}>
			{props.showPresence && props.presence ? (
				!ringsEnabled ? (
					<div
						style={{
							position: "relative",
							display: "inline-block",
							width: props.size,
							height: props.size,
						}}
					>
						<img
							style={{
								borderRadius: "50%",
								width: props.size,
								height: props.size,
								objectFit: "cover",
							}}
							src={user.avatarUrl}
							loading="eager"
						/>
						<div
							style={{
								position: "absolute",
								width: props.statusDotStyle?.size ?? 14,
								height: props.statusDotStyle?.size ?? 14,
								backgroundColor: app.theme.getStatusColor(
									props.presence?.status ?? PresenceUpdateStatus.Offline,
								),
								borderRadius: "50%",
								bottom: 0,
								right: 0,
								border: `${
									props.statusDotStyle?.borderThickness ?? 0.2
								}rem solid var(--background-secondary)`,
							}}
						></div>
					</div>
				) : (
					<img
						width={props.size}
						height={props.size}
						style={{
							borderRadius: "50%",
							pointerEvents: "none",
							border: `0.2rem solid ${app.theme.getStatusColor(
								props.presence?.status ?? PresenceUpdateStatus.Offline,
							)}`,
						}}
						src={user.avatarUrl}
						loading="eager"
					/>
				)
			) : (
				<img
					width={props.size}
					height={props.size}
					style={{
						borderRadius: "50%",
						pointerEvents: "none",
					}}
					src={user.avatarUrl}
					loading="eager"
				/>
			)}
		</Wrapper>
	);

	return children;
}

export default observer(Avatar);
