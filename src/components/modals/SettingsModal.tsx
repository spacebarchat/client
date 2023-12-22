import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { arch, locale, platform, version } from "@tauri-apps/plugin-os";
import { observer } from "mobx-react-lite";
import React from "react";
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

interface VersionInfo {
	tauri: string;
	app: string;
	platform: {
		name: string;
		arch: string;
		version: string;
		locale: string | null;
	};
}

export const SettingsModal = observer(({ ...props }: ModalProps<"settings">) => {
	const app = useAppStore();
	const [versionInfo, setVersionInfo] = React.useState<VersionInfo | undefined>(undefined);

	const getVersionInfo = React.useMemo(
		() => async () => {
			const [tauriVersion, appVersion, platformName, platformArch, platformVersion, platformLocale] =
				await Promise.all([getTauriVersion(), getVersion(), platform(), arch(), version(), locale()]);

			setVersionInfo({
				tauri: tauriVersion,
				app: appVersion,
				platform: {
					name: platformName,
					arch: platformArch,
					version: platformVersion,
					locale: platformLocale,
				},
			});
		},
		[],
	);

	React.useEffect(() => {
		if (isTauri) {
			getVersionInfo();
		}
	}, [getVersionInfo]);

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
							<span>App Version: {versionInfo?.app ?? "Fetching version information..."}</span>
							<span>Tauri Version: {versionInfo?.tauri ?? "Fetching version information..."}</span>
							<span>Platform: {versionInfo?.platform.name}</span>
							<span>Arch: {versionInfo?.platform.arch}</span>
							<span>OS Version: {versionInfo?.platform.version}</span>
							<span>Locale: {versionInfo?.platform.locale ?? "Unknown"}</span>
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
