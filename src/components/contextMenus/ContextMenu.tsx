// modified from https://github.com/revoltchat/frontend/blob/master/components/app/menus/ContextMenu.tsx
// changed some styling

import { ComponentProps } from "react";
import styled from "styled-components";
import Icon, { IconProps } from "../Icon";

export const ContextMenu = styled.div`
	display: flex;
	flex-direction: column;
	padding: 6px 8px;

	overflow: hidden;
	border-radius: 4px;
	background: var(--background-tertiary);
	color: var(--text);

	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
`;

export const ContextMenuDivider = styled.div`
	height: 1px;
	margin: 4px;
	background: var(--text);
`;

export const ContextMenuItem = styled("a")`
	display: block;
	padding: 6px 8px;
	border-radius: 4px;
	font-size: 14px;
	margin: 2px 0;
	cursor: pointer;
`;

const ButtonBase = styled(ContextMenuItem)<{ destructive?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;

	> span {
		margin-top: 1px;
	}

	&:hover {
		background: ${(props) => (props.destructive ? "var(--danger)" : "var(--primary)")};
		${(props) => (props.destructive ? `color: var(--text)` : "")}
	}

	${(props) => (props.destructive ? `fill: var(--danger); color: var(--danger)` : "")}
`;

type ButtonProps = ComponentProps<typeof ContextMenuItem> & {
	icon?: IconProps["icon"];
	destructive?: boolean;
};

export function ContextMenuButton(props: ButtonProps) {
	return (
		<ButtonBase {...props}>
			<span>{props.children}</span>
			{props.icon && <Icon icon={props.icon} size="18px" />}
		</ButtonBase>
	);
}
