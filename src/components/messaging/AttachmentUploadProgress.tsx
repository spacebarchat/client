import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { QueuedMessage } from "../../stores/MessageQueue";
import Icon from "../Icon";
import IconButton from "../IconButton";

const Container = styled.div`
	max-width: 25%;
	width: 100%;
	border: 1px solid transparent;
	padding: 10px;
	border-radius: 4px;
	background-color: var(--background-secondary);
	border-color: var(--background-secondary-alt);
	flex-direction: row;
	align-items: center;
	display: flex;
`;

const Wrapper = styled.div`
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
`;

const Progress = styled.progress`
	height: 6px;
	width: 100%;
`;

const CustomIcon = styled(Icon)`
	color: var(--text-secondary);

	&:hover {
		color: var(--text);
	}
`;

interface Props {
	message: QueuedMessage;
}

function AttachmentUploadProgress({ message }: Props) {
	console.log(message.progress);

	return (
		<Container>
			<Wrapper>
				<div>{message.files!.length === 1 ? message.files![0].name : `${message.files!.length} files`}</div>
				<Progress value={message.progress} max={100} />
			</Wrapper>
			<IconButton variant="blank">
				<CustomIcon icon="mdiClose" size="24px" />
			</IconButton>
		</Container>
	);
}

export default observer(AttachmentUploadProgress);
