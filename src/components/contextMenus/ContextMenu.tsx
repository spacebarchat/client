// modified from https://github.com/revoltchat/frontend/blob/master/components/app/menus/ContextMenu.tsx
// changed some styling

import { ComponentProps } from "react";
import styled from "styled-components";
import Icon, { IconProps } from "../Icon";

export const ContextMenu = styled.div`
	display: flex;
	flex-direction: column;
	padding: 6px 8px;
	min-width: 200px;
	max-width: 300px;

	overflow: hidden;
	border-radius: 4px;
	background: var(--background-tertiary);
	color: var(--text);

	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
`;

export const ContextMenuDivider = styled.div`
	height: 1px;
	margin: 4px;
	background: var(--text-disabled);
`;

export const ContextMenuItem = styled("button")`
	display: block;
	padding: 6px 8px;
	border-radius: 4px;
	font-size: 14px;
	margin: 2px 0;
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
	opacity: ${(props) => (props.disabled ? 0.5 : 1)};

	// remove default button styles
	border: none;
	background: none;
	color: inherit;
	outline: none;
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
	iconProps?: Omit<IconProps, "icon" | "size">;
	destructive?: boolean;
};

export function ContextMenuButton({ icon, children, iconProps, ...props }: ButtonProps) {
	return (
		<ButtonBase {...props}>
			<span>{children}</span>
			{icon && <Icon icon={icon} {...iconProps} size="18px" />}
		</ButtonBase>
	);
}
