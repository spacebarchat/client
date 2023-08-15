import styled from "styled-components";
import Container from "./Container";
import Icon, { IconProps } from "./Icon";

const ContextMenuContainer = styled(Container)`
	border-radius: 4px;
	min-height: 32px;
	cursor: pointer;
`;

const Wrapper = styled(Container)<{ bgColor?: string }>`
	border-radius: 4px;
	padding: 6px 8px;
	flex: 1 1 auto;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
	justify-content: space-between;
	align-items: center;

	&:hover {
		background-color: ${(props) => props.bgColor ?? "var(--primary)"};
	}
`;

export interface IContextMenuItem {
	label: string;
	onClick: React.MouseEventHandler<HTMLDivElement>;
	iconProps?: IconProps;
}

interface Props {
	item: IContextMenuItem;
	index: number;
	close: () => void;
}

function ContextMenuItem({ item, index, close }: Props) {
	return (
		<ContextMenuContainer
			key={index}
			onClick={(e) => {
				item.onClick(e);
				close();
			}}
		>
			<Wrapper>
				<div>{item.label}</div>
				{item.iconProps && (
					<Icon
						size={item.iconProps.size ?? "20px"}
						color={item.iconProps.color ?? "var(--text)"}
						{...item.iconProps}
					/>
				)}
			</Wrapper>
		</ContextMenuContainer>
	);
}

export default ContextMenuItem;
