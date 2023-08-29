import { useModals } from "@mattjennings/react-modal-stack";
import Icon from "../Icon";
import { Modal, ModalCloseWrapper, ModalFullContent, ModalFullSidebar } from "./ModalComponents";
import { AnimatedModalProps } from "./ModalRenderer";

function SettingsModal(props: AnimatedModalProps) {
	const { closeModal } = useModals();

	return (
		<Modal full {...props}>
			<ModalFullSidebar>Sidebar</ModalFullSidebar>

			<ModalFullContent>
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
				Content
			</ModalFullContent>
		</Modal>
	);
}

export default SettingsModal;
