import React from "react";
import styled from "styled-components";
import Container from "./Container";
import Icon, { IconProps } from "./Icon";

export interface IContextMenuItem {
	label: string;
	color?: string;
	onClick: React.MouseEventHandler<HTMLDivElement>;
	iconProps?: IconProps;
	hover?: {
		color?: string;
		backgroundColor?: string;
	};
}

const ContextMenuContainer = styled(Container)`
	border-radius: 4px;
	min-height: 32px;
	cursor: pointer;
`;

// we handle the hover state ourselves to prevent "lag" with the icon color
const Wrapper = styled(Container)<{ hover?: IContextMenuItem["hover"]; hovered?: boolean }>`
	border-radius: 4px;
	padding: 6px 8px;
	flex: 1 1 auto;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: ${(props) => (props.hovered ? props.hover?.color ?? "var(--text)" : props.color ?? "var(--text)")};
	background-color: ${(props) => (props.hovered ? props.hover?.backgroundColor ?? "var(--primary)" : "transparent")};
`;

interface Props {
	item: IContextMenuItem;
	index: number;
	close: () => void;
}

function ContextMenuItem({ item, index, close }: Props) {
	const [isHovered, setIsHovered] = React.useState(false);

	return (
		<ContextMenuContainer
			key={index}
			onClick={(e) => {
				item.onClick(e);
				close();
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Wrapper hover={item.hover} hovered={isHovered} color={item.color}>
				<div
					style={{
						// color: item.color ?? "var(--text)",
						fontWeight: 500,
						fontSize: "14px",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					{item.label}
				</div>
				{item.iconProps && (
					<Icon
						{...item.iconProps}
						size={item.iconProps.size ?? "20px"}
						color={isHovered ? item.hover?.color ?? "var(--text)" : item.iconProps.color ?? "var(--text)"}
					/>
				)}
			</Wrapper>
		</ContextMenuContainer>
	);
}

export default ContextMenuItem;
