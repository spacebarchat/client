import { useModals } from "@mattjennings/react-modal-stack";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useAppStore } from "../../stores/AppStore";
import { GIT_BRANCH, GIT_REVISION, REPO_URL } from "../../utils/revison";
import Button from "../Button";
import Icon from "../Icon";
import Link from "../Link";
import {
	Modal,
	ModalCloseWrapper,
	ModalFullContent,
	ModalFullContentContainer,
	ModalFullContentContainerContentWrapper,
	ModalFullContentWrapper,
	ModalFullSidebar,
	ModalFullSidebarContainer,
	ModalFullSidebarContent,
} from "./ModalComponents";
import { AnimatedModalProps } from "./ModalRenderer";

function SettingsModal(props: AnimatedModalProps) {
	const app = useAppStore();
	const { closeModal, closeAllModals } = useModals();

	const logout = () => {
		app.logout();
		closeAllModals();
	};

	return (
		<Modal full {...props}>
			<ModalFullSidebar>
				<ModalFullSidebarContainer>
					<ModalFullSidebarContent>
						SIDEBAR
						<Button variant="danger" onClick={logout}>
							Logout
						</Button>
					</ModalFullSidebarContent>
				</ModalFullSidebarContainer>
			</ModalFullSidebar>

			<ModalFullContentContainer>
				<ModalFullContentWrapper>
					<ModalFullContentContainerContentWrapper>
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

							<div>
								<span>Client Version: </span>
								<Link href={`${REPO_URL}/commit/${GIT_REVISION}`} target="_blank" rel="noreferrer">
									{GIT_REVISION.substring(0, 7)}
								</Link>
								{` `}
								<Link
									href={GIT_BRANCH !== "DETACHED" ? `${REPO_URL}/tree/${GIT_BRANCH}` : undefined}
									target="_blank"
									rel="noreferrer"
								>
									({GIT_BRANCH})
								</Link>
							</div>

							<FormGroup>
								<FormControlLabel
									control={
										<Switch
											checked={app.fpsShown}
											onChange={(e) => app.setFpsShown(e.target.checked)}
										/>
									}
									label="Show FPS Graph"
								/>
							</FormGroup>
						</ModalFullContent>
					</ModalFullContentContainerContentWrapper>
				</ModalFullContentWrapper>
			</ModalFullContentContainer>
		</Modal>
	);
}

export default observer(SettingsModal);
