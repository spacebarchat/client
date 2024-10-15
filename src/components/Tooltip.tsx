import { FloatingProps } from "@components/floating";
import styled from "styled-components";

const Container = styled.div`
	background-color: var(--background-tertiary);
	line-height: 16px;
	box-sizing: border-box;
	font-size: 14px;
	padding: 8px 12px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 250px;
	border-radius: 4px;
	color: var(--text);
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
`;

function Tooltip(props: FloatingProps<"tooltip">) {
	if (!props) return null;
	return <Container aria-label={props.aria}>{props.content}</Container>;
}

export default Tooltip;
