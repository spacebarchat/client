import Avatar from "@components/Avatar";
import Button from "@components/Button";
import SectionTitle from "@components/SectionTitle";
import { useAppStore } from "@hooks/useAppStore";
import { RESTPatchAPICurrentUserJSONBody, Routes } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

const Content = styled.div`
	display: flex;
	flex-direction: column;

	min-width: 30vw;
`;

const UserInfoContainer = styled.div`
	border-radius: 8px;
	background-color: var(--background-secondary);
	padding: 16px;
`;

const Field = styled.div<{ spacerTop?: boolean; spacerBottom?: boolean }>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;

	${(props) =>
		props.spacerTop &&
		css`
			margin-top: 24px;
		`}

	${(props) =>
		props.spacerBottom &&
		css`
			margin-bottom: 24px;
		`}
`;

const Row = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: hidden;
	margin-right: 16px;
`;

const FieldTitle = styled.span`
	margin-bottom: 4px;
	color: var(--text-secondary);
	font-size: 12px;
	font-weight: var(--font-weight-medium);
	letter-spacing: 0.5px;
`;

const FieldValue = styled.div`
	overflow: hidden;
	text-overflow: ellipsis;
`;

const FieldValueText = styled.span`
	color: var(--text);
	font-size: 16px;
	font-weight: var(--font-weight-regular);
`;

const FieldValueToggle = styled.button`
	color: var(--text-link);
	cursor: pointer;
	width: auto;
	display: inline;
	height: auto;
	padding: 2px 4px;
	position: relative;
	background: none;
	border: none;
	border-radius: 4px;
	font-size: 14px;
	font-weight: var(--font-weight-medium);
	user-select: none;
	text-rendering: optimizeLegibility;
`;

const IconContainer = styled.div`
	position: relative;
	display: inline-block;
`;

const IconInput = styled.input`
	display: none;
`;

const FileInput = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	cursor: pointer;
	font-size: 0px;
`;

const UnsavedChangesBar = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background-color: var(--background-tertiary);
	padding: 10px 16px;
	border-radius: 8px;
	margin-top: 24px;
	align-items: center;
`;

const UnsavedChangedActions = styled.div`
	display: flex;
	gap: 10px;
`;

const Text = styled.p`
	color: var(--text-secondary);
	font-size: 16px;
	font-weight: var(--font-weight-medium);
	margin: 0;
	padding: 0;
`;

function AccountSettingsPage() {
	const app = useAppStore();
	const [shouldRedactEmail, setShouldRedactEmail] = useState(true);
	const [selectedFile, setSelectedFile] = useState<File>();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [hasUnsavedChangd, setHasUnsavedChanged] = useState(false);
	const [loading, setLoading] = useState(false);

	const redactEmail = (email: string) => {
		const [username, domain] = email.split("@");
		return `${"*".repeat(username.length)}@${domain}`;
	};

	const redactPhoneNumber = (phoneNumber: string) => {
		const lastFour = phoneNumber.slice(-4);
		return "*".repeat(phoneNumber.length - 4) + lastFour;
	};

	const onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;
		setSelectedFile(event.target.files[0]);
	};

	const discardChanges = () => {
		setSelectedFile(undefined);
	};

	const save = async () => {
		setLoading(true);
		if (!selectedFile) return;
		const reader = new FileReader();
		reader.onload = async () => {
			const payload: RESTPatchAPICurrentUserJSONBody = {
				// @ts-expect-error broken types or whatever
				avatar: reader.result,
			};
			app.rest
				.patch<RESTPatchAPICurrentUserJSONBody, RESTPatchAPICurrentUserJSONBody>(Routes.user(), payload)
				.then((r) => {
					// runInAction(() => {
					// 	if (r.username) app.account!.username = r.username;
					// 	if (r.avatar) app.account!.avatar = r.avatar;
					// });
					setSelectedFile(undefined);
					setLoading(false);
				})
				.catch((e) => {
					console.error(e);
					setLoading(false);
				});
		};
		reader.readAsDataURL(selectedFile);
	};

	useEffect(() => {
		// handle unsaved changes state
		if (selectedFile) {
			setHasUnsavedChanged(true);
		} else {
			// Reset state if there is nothing changed
			setHasUnsavedChanged(false);
		}
	}, [selectedFile]);

	return (
		<div>
			<SectionTitle>Account</SectionTitle>
			<Content>
				<UserInfoContainer>
					<Field spacerBottom>
						<IconContainer>
							{selectedFile ? (
								<img
									src={URL.createObjectURL(selectedFile)}
									alt="Avatar"
									width="80px"
									height="80px"
									style={{
										borderRadius: "50%",
										pointerEvents: "none",
										objectFit: "cover",
									}}
								/>
							) : (
								<Avatar user={app.account!} size={80} />
							)}
							<IconInput
								ref={fileInputRef}
								type="file"
								name="avatar"
								accept="image/*"
								onChange={onAvatarChange}
								disabled={loading}
							/>
							<FileInput
								role="button"
								onClick={() => fileInputRef.current?.click()}
								aria-disabled={loading}
							/>
						</IconContainer>
					</Field>

					<Field spacerBottom>
						<Row>
							<FieldTitle>Username</FieldTitle>

							<FieldValue>
								<FieldValueText>
									{app.account?.username}#{app.account?.discriminator}
								</FieldValueText>
							</FieldValue>
						</Row>
					</Field>

					<Field>
						<Row>
							<FieldTitle>Email</FieldTitle>

							<FieldValue>
								<FieldValueText>
									{app.account?.email
										? shouldRedactEmail
											? redactEmail(app.account.email)
											: app.account.email
										: "No email added."}

									<FieldValueToggle onClick={() => setShouldRedactEmail(!shouldRedactEmail)}>
										{shouldRedactEmail ? "Reveal" : "Hide"}
									</FieldValueToggle>
								</FieldValueText>
							</FieldValue>
						</Row>
					</Field>

					<Field spacerTop>
						<Row>
							<FieldTitle>Phone Number</FieldTitle>

							<FieldValue>
								<FieldValueText>No phone number added.</FieldValueText>
							</FieldValue>
						</Row>
					</Field>
				</UserInfoContainer>

				{hasUnsavedChangd && (
					<UnsavedChangesBar>
						<Text>You have unsaved changes.</Text>
						<UnsavedChangedActions>
							<Button palette="link" onClick={discardChanges} disabled={loading}>
								Discard
							</Button>
							<Button palette="primary" disabled={loading} onClick={save}>
								{loading ? "Saving..." : "Save"}
							</Button>
						</UnsavedChangedActions>
					</UnsavedChangesBar>
				)}
			</Content>
		</div>
	);
}

export default observer(AccountSettingsPage);
