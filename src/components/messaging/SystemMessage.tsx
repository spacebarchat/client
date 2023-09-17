import React from "react";
import styled from "styled-components";
import { MessageLike } from "../../stores/objects/Message";
import Icon, { IconProps } from "../Icon";
import MessageTimestamp from "./MessageTimestamp";

const Container = styled.div`
	display: flex;
	flex-direction: row;
`;

interface Props {
	message: MessageLike;
	children: React.ReactNode;
	iconProps?: IconProps;
}

function SystemMessage({ message, children, iconProps }: Props) {
	return (
		<Container>
			<div style={{ margin: "0 10px", display: "flex" }}>{iconProps && <Icon {...iconProps} />}</div>
			<div
				style={{
					color: "var(--text-secondary)",
					fontWeight: "var(--font-weight-regular)",
					fontSize: "16px",
				}}
			>
				{children}
			</div>
			<MessageTimestamp date={message.timestamp} />
		</Container>
	);
}

export default SystemMessage;
