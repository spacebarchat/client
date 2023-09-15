import { useModals } from "@mattjennings/react-modal-stack";
import { Routes } from "@spacebarchat/spacebar-api-types/v9";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppStore } from "../../stores/AppStore";
import Guild from "../../stores/objects/Guild";
import Icon from "../Icon";
import {
	Modal,
	ModalActionItem,
	ModalCloseWrapper,
	ModalFooter,
	ModalHeaderText,
	ModelContentContainer,
} from "./ModalComponents";
import { AnimatedModalProps } from "./ModalRenderer";

export const ModalHeader = styled.div`
	padding: 16px;
`;

const CancelButton = styled(ModalActionItem)`
	transition: background-color 0.2s ease-in-out;
	margin-bottom: 8px;
	font-size: 14px;
	font-weight: var(--font-weight-medium);

	&:hover {
		text-decoration: underline;
	}
`;

const LeaveButton = styled(ModalActionItem)`
	transition: background-color 0.2s ease-in-out;
	margin-bottom: 8px;
	font-size: 14px;
	font-weight: var(--font-weight-medium);
	border-radius: 4px;
	background-color: var(--danger);

	&:hover {
		background-color: var(--background-secondary-highlight);
	}
`;

interface Props {
	guild: Guild;
}

function LeaveServerModal(props: Props & AnimatedModalProps) {
	const app = useAppStore();
	const { closeModal } = useModals();
	const navigate = useNavigate();

	if (!open) {
		return null;
	}

	const handleLeaveServer = () => {
		app.rest.delete(Routes.userGuild(props.guild.id)).finally(() => {
			closeModal();
			// navigate to @me
			navigate("/channels/@me");
		});
	};

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
				<ModalHeaderText>Leave {props.guild.name}</ModalHeaderText>
			</ModalHeader>

			<ModelContentContainer>
				<span>
					Are you sure you want to leave <b>{props.guild.name}</b>? You won't be able to rejoin this server
					unless you are re-invited.
				</span>
			</ModelContentContainer>

			<ModalFooter
				style={{
					flexDirection: "row",
					justifyContent: "flex-end",
				}}
			>
				<CancelButton
					variant="link"
					size="med"
					onClick={() => {
						closeModal();
					}}
				>
					Cancel
				</CancelButton>

				<LeaveButton
					variant="outlined"
					size="med"
					onClick={handleLeaveServer}
					style={{
						backgroundColor: "var(--danger)",
					}}
				>
					Leave
				</LeaveButton>
			</ModalFooter>
		</Modal>
	);
}

export default LeaveServerModal;
