import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { useAppStore } from "../../../stores/AppStore";
import QueuedMessage from "../../../stores/objects/QueuedMessage";
import { bytesToSize } from "../../../utils/Utils";
import Icon from "../../Icon";
import IconButton from "../../IconButton";

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

	.muted {
		color: var(--text-secondary);
	}
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
	const app = useAppStore();
	const totalSize = message.files!.reduce((p, f) => p + f.size, 0);

	return (
		<Container>
			<Wrapper>
				<div
					style={{
						gap: "5px",
						display: "flex",
					}}
				>
					<span>Uploading</span>
					<span>
						{message.files!.length === 1 ? message.files![0].name : `${message.files!.length} files`}
					</span>
					<span className="muted">-</span>
					<span className="muted">{bytesToSize(totalSize)}</span>
				</div>
				<Progress value={message.progress} max={100} />
			</Wrapper>
			<IconButton
				variant="blank"
				onClick={() => {
					message.abort();
					// remove the message from the queue
					app.queue.remove(message.id);
				}}
			>
				<CustomIcon icon="mdiClose" size="24px" />
			</IconButton>
		</Container>
	);
}

export default observer(AttachmentUploadProgress);
