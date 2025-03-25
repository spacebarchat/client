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
`;

interface Props {
    fullText: string;
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
		>
			<Container>
				<code>{props.fullText}</code>
			</Container>
		</Modal>
	);
}
