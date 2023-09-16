import { useModals } from "@mattjennings/react-modal-stack";
import { Slider } from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";
import { useAppStore } from "../../stores/AppStore";
import { isTauri } from "../../utils/Utils";
import { GIT_BRANCH, GIT_REVISION, REPO_URL } from "../../utils/revison";
import Button from "../Button";
import Icon from "../Icon";
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

const ZOOM_MARKS = [
	{
		value: 50,
		label: "50%",
	},
	{
		value: 60,
		label: "60%",
	},
	{
		value: 70,
		label: "70%",
	},
	{
		value: 80,
		label: "80%",
	},
	{
		value: 90,
		label: "90%",
	},
	{
		value: 100,
		label: "100%",
	},
	{
		value: 110,
		label: "110%",
	},
	{
		value: 120,
		label: "120%",
	},
	{
		value: 150,
		label: "150%",
	},
	{
		value: 170,
		label: "170%",
	},
	{
		value: 200,
		label: "200%",
	},
];

function SettingsModal(props: AnimatedModalProps) {
	const app = useAppStore();
	const { closeModal, closeAllModals } = useModals();
	const [value, setValue] = React.useState(app.zoom * 100);

	const logout = () => {
		app.logout();
		closeAllModals();
	};

	const onZoomChange = (e: Event, v: number | number[], at: number) => setValue(v instanceof Array ? v[0] : v);
	const commitZoom = () => app.setZoom(value / 100);

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
								<a href={`${REPO_URL}/commit/${GIT_REVISION}`} target="_blank" rel="noreferrer">
									{GIT_REVISION.substring(0, 7)}
								</a>
								{` `}
								<a
									href={GIT_BRANCH !== "DETACHED" ? `${REPO_URL}/tree/${GIT_BRANCH}` : undefined}
									target="_blank"
									rel="noreferrer"
								>
									({GIT_BRANCH})
								</a>
							</div>

							{isTauri && (
								<div>
									<Slider
										value={value}
										defaultValue={value}
										step={null}
										marks={ZOOM_MARKS}
										min={50}
										max={200}
										onChange={onZoomChange}
										onChangeCommitted={commitZoom}
									/>
								</div>
							)}
						</ModalFullContent>
					</ModalFullContentContainerContentWrapper>
				</ModalFullContentWrapper>
			</ModalFullContentContainer>
		</Modal>
	);
}

export default observer(SettingsModal);
