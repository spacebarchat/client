import { observer } from "mobx-react-lite";
import { useState } from "react";
import styled, { css } from "styled-components";
import { ModalProps, modalController } from "../../controllers/modals";
import { useAppStore } from "../../stores/AppStore";
import { isTauri } from "../../utils/Utils";
import { APP_VERSION, GIT_BRANCH, GIT_REVISION, REPO_URL } from "../../utils/revison";
import Icon from "../Icon";
import Link from "../Link";
import { Modal } from "./ModalComponents";
import AccountSettingsPage from "./SettingsPages/AccountSettingsPage";
import DeveloperSettingsPage from "./SettingsPages/DeveloperSettingsPage";
import ExperimentsPage from "./SettingsPages/ExperimentsPage";

const SidebarView = styled.div`
	display: flex;
	flex: 1;
	overflow: hidden;
`;

const Sidebar = styled.div`
	display: flex;
	flex: 1 0 220px;
	justify-content: flex-end;
`;

const SidebarInner = styled.div`
	overflow: hidden scroll;
	display: flex;
	flex: 1 0 auto;
	flex-direction: row;
	justify-content: flex-end;
	align-items: flex-start;
	background: var(--background-secondary);
`;

const SidebarNav = styled.nav`
	width: 220px;
	padding: 60px 6px 20px;
	box-sizing: border-box;
`;

const SidebarNavWrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const Content = styled.div`
	display: flex;
	flex: 1 1 800px;
	align-items: flex-start;
	background: var(--background-primary);
`;

const ContentInner = styled.div`
	overflow: hidden scroll;
	justify-content: flex-start;
	position: static;
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	background: var(--background-primary);
	box-sizing: border-box;
`;

const ContentColumn = styled.div`
	padding: 60px 40px 80px;
	flex: 1 1 auto;
	max-width: 740px;
	min-width: 460px;
	min-height: 100%;
	box-sizing: border-box;
`;

const Header = styled.div`
	padding: 6px 10px;
	color: var(--text-secondary);
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	flex-shrink: 0;
	font-size: 14px;
	font-weight: var(--font-weight-bold);
	letter-spacing: 0.5px;
`;

const Item = styled.div<{ selected?: boolean; textColor?: string }>`
	padding: 5px 10px;
	margin-bottom: 5px;
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
	font-weight: var(--font-weight-regular);
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	flex-shrink: 0;
	color: ${(props) => props.textColor ?? "var(--text-secondary);"};

	&:hover {
		background-color: hsl(var(--background-primary-hsl) / 0.6);
		cursor: pointer;
	}

	${(props) =>
		props.selected &&
		css`
			background-color: var(--background-primary);
			color: var(--text);
		`}
`;

const Divider = styled.div`
	margin: 8px 10px;
	height: 1px;
	background-color: var(--text-disabled);
`;

const VersionInfo = styled.div`
	padding: 8px 10px;
	color: var(--text-secondary);
	font-size: 12px;
	font-weight: var(--font-weight-regular);
`;

const CloseContainer = styled.div`
	margin-right: 20px;
	flex: 0 0 36px;
	width: 60px;
	padding-top: 60px;
	position: relative;
`;

const CloseContainerInner = styled.div`
	position: fixed;
`;

const CloseContainerWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const CloseButtonWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 0 0 40px;
	border: solid 1px;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	cursor: pointer;
	color: var(--text-secondary);
`;

export const SettingsModal = observer(({ ...props }: ModalProps<"settings">) => {
	const app = useAppStore();
	const [index, setIndex] = useState(0);

	const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const value = e.currentTarget.getAttribute("data-value");
		if (value) {
			setIndex(parseInt(value));
		}
	};

	return (
		<Modal {...props} fullScreen withoutCloseButton withEmptyActionBar padding="0">
			<SidebarView>
				<Sidebar>
					<SidebarInner>
						<SidebarNav>
							<SidebarNavWrapper>
								<Header>User Settings</Header>
								<Item data-value="0" onClick={onClick}>
									Account
								</Item>
								<Divider />
								<Item data-value="1" onClick={onClick}>
									Developer Options
								</Item>
								<Item data-value="2" onClick={onClick}>
									Experiments
								</Item>
								<Divider />
								<Item onClick={app.logout}>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											color: "var(--error)",
										}}
									>
										Log Out
										<Icon icon="mdiLogout" size="16px" color="var(--error)" />
									</div>
								</Item>
								<Divider />
								<VersionInfo>
									<span>
										{GIT_BRANCH} {APP_VERSION} (
										<Link
											href={`${REPO_URL}/commit/${GIT_REVISION}`}
											target="_blank"
											rel="noreferrer"
										>
											{GIT_REVISION.substring(0, 7)}
										</Link>
										)
									</span>
									{isTauri && (
										<>
											{/* <span>
												{window.globals.appVersion
													? `${window.globals.appVersion} (${(
															<Link
																href={`${REPO_URL}/commit/${GIT_REVISION}`}
																target="_blank"
																rel="noreferrer"
															>
																{GIT_REVISION.substring(0, 7)}
															</Link>
													  )})`
													: "Fetching version information..."}
											</span> */}
											<span>
												Tauri {window.globals.tauriVersion ?? "Fetching version information..."}
											</span>
											<span>{`${window.globals.platform.name} ${window.globals.platform.arch} (${window.globals.platform.version})`}</span>
											<span>{window.globals.platform.locale ?? "Unknown"}</span>
										</>
									)}
								</VersionInfo>
							</SidebarNavWrapper>
						</SidebarNav>
					</SidebarInner>
				</Sidebar>
				<Content>
					<ContentInner>
						<ContentColumn>
							{index === 0 && <AccountSettingsPage />}
							{index === 1 && <DeveloperSettingsPage />}
							{index === 2 && <ExperimentsPage />}
						</ContentColumn>
						<CloseContainer>
							<CloseContainerInner></CloseContainerInner>
							<CloseContainerWrapper>
								<CloseButtonWrapper onClick={() => modalController.close()}>
									<Icon icon="mdiClose" size="18px" />
								</CloseButtonWrapper>
							</CloseContainerWrapper>
						</CloseContainer>
					</ContentInner>
				</Content>
			</SidebarView>
		</Modal>
	);
});
