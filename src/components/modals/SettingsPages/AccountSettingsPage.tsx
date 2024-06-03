import { observer } from "mobx-react-lite";
import { useState } from "react";
import styled, { css } from "styled-components";
import { useAppStore } from "../../../stores/AppStore";
import SectionTitle from "../../SectionTitle";

const Content = styled.div`
	display: flex;
	flex-direction: column;
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

function AccountSettingsPage() {
	const app = useAppStore();
	const [shouldRedactEmail, setShouldRedactEmail] = useState(true);

	const redactEmail = (email: string) => {
		const [username, domain] = email.split("@");
		return `${"*".repeat(username.length)}@${domain}`;
	};

	const refactPhoneNumber = (phoneNumber: string) => {
		const lastFour = phoneNumber.slice(-4);
		return "*".repeat(phoneNumber.length - 4) + lastFour;
	};

	return (
		<div>
			<SectionTitle>Account</SectionTitle>
			<Content>
				<UserInfoContainer>
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
			</Content>
		</div>
	);
}

export default observer(AccountSettingsPage);
