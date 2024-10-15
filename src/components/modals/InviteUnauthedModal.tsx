import { ModalProps } from "@/controllers/modals";
import styled from "styled-components";
import { Modal, ModalHeader, ModalHeaderText, ModalSubHeaderText } from "./ModalComponents";

const ActionWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export function InviteUnauthedModal({ inviteData, ...props }: ModalProps<"invite">) {
	return (
		<Modal nonDismissable>
			<ModalHeader>
				<ModalSubHeaderText>You've been invited to join</ModalSubHeaderText>
				<ModalHeaderText>{inviteData.guild?.name}</ModalHeaderText>
			</ModalHeader>
		</Modal>
	);
}
