import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import User from "../stores/objects/User";
import Container from "./Container";

const Wrapper = styled(Container)<{ size: number }>`
	width: ${(props) => props.size}px;
	height: ${(props) => props.size}px;
	border-radius: 50%;
	position: relative;

	&:hover {
		text-decoration: underline;
		cursor: pointer;
	}
`;

interface Props {
	user?: User;
	size?: number;
	style?: React.CSSProperties;
}

function Avatar(props: Props) {
	const app = useAppStore();

	return (
		<Wrapper size={props.size ?? 32} style={props.style}>
			<img
				src={props.user?.avatarUrl ?? app.account?.avatarUrl}
				width={props.size ?? 32}
				height={props.size ?? 32}
			/>
		</Wrapper>
	);
}

export default observer(Avatar);
