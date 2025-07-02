import styled from "styled-components";
import { Modal } from "./ModalComponents";

const Container = styled.div`
	display: flex;
	overflow: hidden;
	flex-direction: column;
	max-width: 90vw;
	max-height: 75vh;
	overflow-x: scroll;
	overflow-y: scroll;
	user-select: text;
	padding: 16px;
	white-space: pre-wrap;
`;

interface Props {
	text: string;
}

export function TextAttachmentViewerModal(props: Props) {
	return (
		<Modal
			{...props}
			transparent
			maxWidth="100vw"
			maxHeight="100vh"
			withoutCloseButton
			withEmptyActionBar
			padding="0"
			wrapperStyle={{
				borderRadius: "10px",
			}}
		>
			<Container>
				<code>{props.text}</code>
			</Container>
		</Modal>
	);
}
