import styled from "styled-components";
import Container from "./Container";
import Icon, { IconProps } from "./Icon";
import Tooltip from "./Tooltip";

const ListItem = styled.li`
	padding: 0;
	margin: 0;
`;

const Wrapper = styled(Container)<{ margin?: boolean }>`
	${(props) => (props.margin !== false ? "margin-top: 9px;" : "")}};
	padding: 0;
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background-color: var(--background-secondary);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: border-radius 0.2s ease, background-color 0.2s ease;

	&:hover {
		border-radius: 30%;
		background-color: var(--primary);
	}
`;

interface Props {
	tooltip?: string;
	action?: () => void;
	image?: React.DetailedHTMLProps<
		React.ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	>;
	icon?: IconProps;
	label?: string;
	margin?: boolean;
}

function SidebarAction(props: Props) {
	if (props.image && props.icon && props.label)
		throw new Error(
			"SidebarAction can only have one of image, icon, or label",
		);

	return (
		<ListItem>
			<Tooltip title={props.tooltip} placement="right">
				<Wrapper onClick={props.action} margin={props.margin}>
					{props.image && <img {...props.image} />}
					{props.icon && <Icon {...props.icon} />}
					{props.label && <span>{props.label}</span>}
				</Wrapper>
			</Tooltip>
		</ListItem>
	);
}

export default SidebarAction;
