import { useModals } from "@mattjennings/react-modal-stack";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Icon from "../Icon";
import AddServerModal from "./AddServerModal";
import {
	ModalActionItem,
	ModalCloseWrapper,
	ModalContainer,
	ModalFooter,
	ModalHeaderText,
	ModalSubHeaderText,
	ModalWrapper,
	ModelContentContainer,
} from "./ModalComponents";

export const ModalHeader = styled.div`
	padding: 16px;
`;

const Input = styled.input`
	border-radius: 8px;
	padding: 10px;
	margin-bottom: 10px;
	border: none;
	outline: none;
	cursor: text;
	font-size: 16px;
	font-weight: 500;
	color: var(--text);
	background-color: var(--background-primary);
`;

const InviteInputContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const FormLabel = styled.label`
	margin-bottom: 8px;
	font-size: 16px;
	color: var(--text-header-secondary);
`;

type FormValues = {
	invite: string;
};

function JoinServerModal() {
	const { openModal, closeModal } = useModals();

	if (!open) {
		return null;
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		setValue,
	} = useForm<FormValues>();

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
					<ModalHeaderText>Join a Guild</ModalHeaderText>
					<ModalSubHeaderText>
						Enter an invite below to join an existing guild.
					</ModalSubHeaderText>
				</ModalHeader>

				<ModelContentContainer>
					<form>
						<InviteInputContainer>
							<FormLabel>Invite Link</FormLabel>
							<Input {...register("invite")} placeholder="https://app.spacebar.chat/invite/cool-guild" type="text" maxLength={9999} required />
						</InviteInputContainer>
					</form>
				</ModelContentContainer>

				<ModalFooter>
					<ModalActionItem variant="filled" size="med">
						Join Guild
					</ModalActionItem>

					<ModalActionItem
						variant="blank"
						size="min"
						onClick={() => {
							closeModal();
							openModal(AddServerModal);
						}}
					>
						Back
					</ModalActionItem>
				</ModalFooter>
			</ModalWrapper>
		</ModalContainer>
	);
}

export default JoinServerModal;
