import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import Container from "./Container";

const Wrapper = styled(Container)<{ size: number }>`
	width: ${(props) => props.size}px;
	height: ${(props) => props.size}px;
	border-radius: 50%;
	position: relative;
`;

interface Props {
	size?: number;
}

function Avatar(props: Props) {
	const app = useAppStore();

	return (
		<Wrapper size={props.size ?? 32}>
			<img
				src={app.account?.getAvatarURL()}
				width={props.size ?? 32}
				height={props.size ?? 32}
			/>
		</Wrapper>
	);
}

export default observer(Avatar);
