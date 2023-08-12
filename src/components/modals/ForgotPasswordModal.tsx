import { useModals } from "@mattjennings/react-modal-stack";
import styled from "styled-components";
import Icon from "../Icon";
import {
	ModalActionItem,
	ModalCloseWrapper,
	ModalContainer,
	ModalFooter,
	ModalHeaderText,
	ModalWrapper,
	ModelContentContainer,
} from "./ModalComponents";

export const ModalHeader = styled.div`
	padding: 16px;
`;

const SubmitButton = styled(ModalActionItem)`
	transition: background-color 0.2s ease-in-out;
	font-size: 16px;

	&:hover {
		background-color: var(--background-secondary-highlight);
	}
`;

function ForgotPasswordModal() {
	const { openModal, closeModal } = useModals();

	if (!open) {
		return null;
	}

	return (
		<ModalContainer>
			<ModalWrapper>
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
					<ModalHeaderText>Instructions Sent</ModalHeaderText>
				</ModalHeader>

				<ModelContentContainer>
					We sent instructions to change your password to user@example.com, please check both your inbox and
					spam folder.
				</ModelContentContainer>

				<ModalFooter>
					<SubmitButton variant="filled" size="med" onClick={closeModal}>
						Okay
					</SubmitButton>
				</ModalFooter>
			</ModalWrapper>
		</ModalContainer>
	);
}

export default ForgotPasswordModal;
