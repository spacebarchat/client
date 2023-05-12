import styled from "styled-components";
import Container from "./Container";

export type PillType = "none" | "unread" | "hover" | "active";

const Wrapper = styled(Container)`
	position: absolute;
	top: 0;
	left: 0;
	width: 8px;
	height: 48px;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	background-color: inherit;
`;

const Pill = styled.span<{ type: PillType }>`
	width: 8px;
	border-radius: 0 4px 4px 0;
	background-color: white;
	margin-left: -4px;
	transition: height 0.3s ease;

	${(props) => {
		switch (props.type) {
			case "unread":
				return `
					height: 8px;
				`;
			case "hover":
				return `
				height: 20px;
				`;
			case "active":
				return `
				height: 40px;
				`;
			default:
				return `
					height: 0;
					`;
		}
	}}
`;

interface Props {
	type: PillType;
}

function SidebarPill({ type }: Props) {
	return (
		<Wrapper>
			<Pill type={type} />
		</Wrapper>
	);
}

export default SidebarPill;
