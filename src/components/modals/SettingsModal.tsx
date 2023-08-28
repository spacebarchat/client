import { useModals } from "@mattjennings/react-modal-stack";
import Icon from "../Icon";
import { ModalCloseWrapper, ModalContainer, ModalFullContent, ModalFullSidebar, ModalWrapper } from "./ModalComponents";

function SettingsModal() {
	const { closeModal } = useModals();

	return (
		<ModalContainer>
			<ModalWrapper full>
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
			</ModalWrapper>
		</ModalContainer>
	);
}

export default SettingsModal;
