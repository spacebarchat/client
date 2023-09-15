import { useModals } from "@mattjennings/react-modal-stack";
import styled from "styled-components";
import Icon from "../Icon";
import {
	Modal,
	ModalActionItem,
	ModalCloseWrapper,
	ModalFooter,
	ModalHeaderText,
	ModalSubHeaderText,
	ModelContentContainer,
} from "./ModalComponents";
import { AnimatedModalProps } from "./ModalRenderer";

export const ModalHeader = styled.div`
	padding: 16px;
`;

const CloseButton = styled(ModalActionItem)`
	transition: background-color 0.2s ease-in-out;
	margin-bottom: 8px;
	font-size: 16px;
	font-weight: var(--font-weight-medium);
`;

interface Props extends AnimatedModalProps {
	title: string;
	subtitle?: string;
	message: React.ReactNode;
}

function ErrorModal(props: Props) {
	const { closeModal } = useModals();

	return (
		<Modal {...props}>
			<ModalCloseWrapper>
				<button
					onClick={closeModal}
					style={{
						background: "none",
						border: "none",
						outline: "none",
					}}
				>
					<Icon
						icon="mdiClose"
						size={1}
						style={{
							cursor: "pointer",
							color: "var(--text)",
						}}
					/>
				</button>
			</ModalCloseWrapper>

			<ModalHeader>
				<ModalHeaderText>{props.title}</ModalHeaderText>
				{props.subtitle && <ModalSubHeaderText>{props.subtitle}</ModalSubHeaderText>}
			</ModalHeader>

			<ModelContentContainer>{props.message}</ModelContentContainer>

			<ModalFooter>
				<CloseButton variant="filled" size="med" onClick={() => closeModal()}>
					Dismiss
				</CloseButton>
			</ModalFooter>
		</Modal>
	);
}

export default ErrorModal;
