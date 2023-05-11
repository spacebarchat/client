import styled from "styled-components";
import Container from "./Container";

const Wrapper = styled(Container)`
	display: flex;
	padding: 12px 16px;
	margin-bottom: 1px;
	background-color: var(--background-secondary);
	box-shadow: 0px 1px 0px hsl(0deg 0% 0% / 0.3);
	align-items: center;
	justify-content: center;
`;

interface Props {
	text: string;
}

function ChannelHeader({ text }: Props) {
	return (
		<Wrapper>
			<header>{text}</header>
		</Wrapper>
	);
}

export default ChannelHeader;
