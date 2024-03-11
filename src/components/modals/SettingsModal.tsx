import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { ModalProps } from "../../controllers/modals";
import { useAppStore } from "../../stores/AppStore";
import { isTauri } from "../../utils/Utils";
import { GIT_BRANCH, GIT_REVISION, REPO_URL } from "../../utils/revison";
import Button from "../Button";
import Link from "../Link";
import { Modal } from "./ModalComponents";

const Wrapper = styled.div`
	padding: 16px 0;
	gap: 8px;
	display: flex;
	flex-direction: column;
`;

const ActionWrapper = styled.div`
	margin-top: 20px;
	gap: 8px;
	display: flex;
`;

const VersionWrapper = styled.div`
	display: flex;
	flex-direction: column;
	user-select: text;

	& > span {
		color: var(--text-secondary);
	}
`;

export const SettingsModal = observer(({ ...props }: ModalProps<"settings">) => {
	const app = useAppStore();

	return (
		<Modal {...props}>
			<Wrapper>
				<FormGroup>
					<FormControlLabel
						control={<Switch checked={app.fpsShown} onChange={(e) => app.setFpsShown(e.target.checked)} />}
						label="Show FPS Graph"
					/>
				</FormGroup>

				{isTauri && (
					<FormGroup>
						<FormControlLabel
							control={
								<Switch
									checked={app.updaterStore?.enabled}
									onChange={(e) => app.updaterStore?.setEnabled(e.target.checked)}
								/>
							}
							label="Enabled auto updater"
						/>
					</FormGroup>
				)}

				<VersionWrapper>
					<span>
						Client Version:{" "}
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
					</span>

					{isTauri && (
						<>
							<span>App Version: {window.globals.appVersion ?? "Fetching version information..."}</span>
							<span>
								Tauri Version: {window.globals.tauriVersion ?? "Fetching version information..."}
							</span>
							<span>Platform: {window.globals.platform.name}</span>
							<span>Arch: {window.globals.platform.arch}</span>
							<span>OS Version: {window.globals.platform.version}</span>
							<span>Locale: {window.globals.platform.locale ?? "Unknown"}</span>
						</>
					)}
				</VersionWrapper>

				<ActionWrapper>
					<Button
						palette="danger"
						onClick={() => {
							app.logout();
						}}
					>
						Logout
					</Button>
				</ActionWrapper>
			</Wrapper>
		</Modal>
	);
});
