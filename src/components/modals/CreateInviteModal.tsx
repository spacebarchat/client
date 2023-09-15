import { useModals } from "@mattjennings/react-modal-stack";
import { APIInvite, Routes } from "@spacebarchat/spacebar-api-types/v9";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import { messageFromFieldError } from "../../utils/messageFromFieldError";
import { Input, InputErrorText, InputLabel, LabelWrapper } from "../AuthComponents";
import Button from "../Button";
import { TextDivider } from "../Divider";
import { InputSelect, InputSelectOption } from "../FormComponents";
import Icon from "../Icon";
import IconButton from "../IconButton";
import { InputContainer } from "./CreateServerModal";
import {
	Modal,
	ModalCloseWrapper,
	ModalHeaderText,
	ModalSubHeaderText,
	ModelContentContainer,
} from "./ModalComponents";
import { AnimatedModalProps } from "./ModalRenderer";

const EXPIRE_OPTIONS = [
	{
		label: "30 Minutes",
		value: 1800,
	},
	{
		label: "1 Hour",
		value: 3600,
	},
	{
		label: "6 Hours",
		value: 21600,
	},
	{
		label: "12 Hours",
		value: 43200,
	},
	{
		label: "1 Day",
		value: 86400,
	},
	{
		label: "7 Days",
		value: 604800,
	},
	{
		label: "30 Days",
		value: 2592000,
	},
	{
		label: "Never",
		value: 0,
	},
];

const MAX_USES_OPTIONS = [
	{
		label: "No Limit",
		value: 0,
	},
	{
		label: "1 use",
		value: 1,
	},
	{
		label: "5 uses",
		value: 5,
	},
	{
		label: "10 uses",
		value: 10,
	},
	{
		label: "25 uses",
		value: 25,
	},
	{
		label: "50 uses",
		value: 50,
	},
	{
		label: "100 uses",
		value: 100,
	},
];

const Mention = styled.span`
	padding: 0 2px;
`;

const ModalHeader = styled.div`
	padding: 24px 24px 0;
`;

const InputWrapper = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
`;

interface InviteModalProps extends AnimatedModalProps {
	channel_id?: string;
	guild_id: string;
}

interface APICreateInvite {
	flags: 0;
	target_type: null;

	max_age: number;
	max_uses: number;
	temporary: boolean;
}

interface FormValues extends APICreateInvite {
	code: string;
}

function CreateInviteModal(props: InviteModalProps) {
	const logger = useLogger("CreateInviteModal");
	const app = useAppStore();
	const { openModal, closeModal } = useModals();
	const [maxAge, setMaxAge] = React.useState(EXPIRE_OPTIONS[5]);
	const [maxUses, setMaxUses] = React.useState(MAX_USES_OPTIONS[0]);
	const [isEdited, setIsEdited] = React.useState(false);
	const [inviteExpiresAt, setInviteExpiresAt] = React.useState<Date | null>(null);

	const guild = app.guilds.get(props.guild_id);
	const channel = props.channel_id ? guild?.channels.get(props.channel_id) : guild?.channels.getAll()[0];

	if (!guild || !channel) {
		closeModal();
		return null;
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		setValue,
		clearErrors,
		getValues,
	} = useForm<FormValues>();

	const [debounce, setDebounce] = React.useState<NodeJS.Timeout | null>(null);

	const createCode = (data?: FormValues) => {
		clearErrors();
		app.rest
			.post<APICreateInvite, APIInvite>(
				Routes.channelInvites(channel.id),
				Object.assign(
					{
						flags: 0,
						target_type: null,
						target_user_id: null,
						max_age: EXPIRE_OPTIONS[5].value,
						max_uses: 0,
						temporary: false,
					},
					data,
					{ code: undefined },
				),
			)
			.then((r) => {
				setValue("code", `${window.location.origin}/invite/${r.code}`);
				setInviteExpiresAt(r.expires_at ? new Date(r.expires_at) : null);
			})
			.catch((r) => {
				if ("message" in r) {
					if (r.errors) {
						const t = messageFromFieldError(r.errors);
						if (t) {
							setError(t.field as keyof FormValues, {
								type: "manual",
								message: t.error,
							});
						} else {
							setError("code", {
								type: "manual",
								message: r.message,
							});
						}
					} else {
						setError("code", {
							type: "manual",
							message: r.message,
						});
					}
				} else {
					// unknown error
					logger.error(r);
					setError("code", {
						type: "manual",
						message: "Unknown Error",
					});
				}
			});
	};

	const onSubmit = handleSubmit((data) => {
		if (debounce) clearTimeout(debounce);
		setDebounce(setTimeout(() => createCode(data), 500));
		setIsEdited(false);
	});

	const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setMaxAge(EXPIRE_OPTIONS.find((x) => x.value === Number(e.target.value)) ?? EXPIRE_OPTIONS[5]);
		setIsEdited(true);
	};

	const handleMaxUsesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setMaxUses(MAX_USES_OPTIONS.find((x) => x.value === Number(e.target.value)) ?? MAX_USES_OPTIONS[0]);
		setIsEdited(true);
	};

	React.useEffect(() => createCode(), []);

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
				<ModalHeaderText>Invite People</ModalHeaderText>
				<ModalSubHeaderText>
					to <Mention>#{channel.name}</Mention> in <Mention>{guild.name}</Mention>
				</ModalSubHeaderText>
			</ModalHeader>

			<ModelContentContainer>
				<form>
					<InputContainer>
						<LabelWrapper error={false}>
							<InputLabel>Expire after</InputLabel>
						</LabelWrapper>
						<InputWrapper>
							<InputSelect
								{...register("max_age", { value: EXPIRE_OPTIONS[5].value })}
								onChange={handleAgeChange}
								value={maxAge.value}
							>
								{EXPIRE_OPTIONS.map((option) => (
									<InputSelectOption value={option.value}>{option.label}</InputSelectOption>
								))}
							</InputSelect>
						</InputWrapper>
					</InputContainer>

					<InputContainer>
						<LabelWrapper error={false}>
							<InputLabel>Maximum Uses</InputLabel>
						</LabelWrapper>
						<InputWrapper>
							<InputSelect
								{...register("max_uses", { value: 0 })}
								onChange={handleMaxUsesChange}
								value={maxUses.value}
							>
								{MAX_USES_OPTIONS.map((option) => (
									<InputSelectOption value={option.value}>{option.label}</InputSelectOption>
								))}
							</InputSelect>
						</InputWrapper>
					</InputContainer>

					<div style={{ display: "flex", justifyContent: "flex-end", margin: "24px 0 12px 0" }}>
						<Button disabled={!isEdited} onClick={onSubmit}>
							Generate new Link
						</Button>
					</div>

					<InputContainer
						style={{
							marginTop: "0",
						}}
					>
						<LabelWrapper error={!!errors.code}>
							<InputLabel>Invite Code</InputLabel>
							{errors.code && (
								<InputErrorText>
									<>
										<TextDivider>-</TextDivider>
										{errors.code.message}
									</>
								</InputErrorText>
							)}
						</LabelWrapper>

						<InputWrapper
							style={{
								background: "var(--background-secondary-alt)",
								borderRadius: "12px",
							}}
						>
							<Input
								autoFocus
								{...register("code")}
								readOnly={true}
								placeholder={`${window.location.origin}/invite/`}
							/>

							<IconButton
								style={{
									marginRight: "8px",
								}}
								onClick={(e) => {
									e.preventDefault();
									navigator.clipboard.writeText(getValues("code"));
								}}
							>
								<Icon icon="mdiContentCopy" size="20px" color="white" />
							</IconButton>
						</InputWrapper>

						<span
							style={{
								color: "var(--text-secondary)",
								marginTop: "8px",
								fontSize: "12px",
								fontWeight: "var(--font-weight-regular)",
								padding: "0 8px",
							}}
						>
							{inviteExpiresAt ? (
								<>This invite will expire {dayjs(inviteExpiresAt).calendar()}</>
							) : (
								"Invite will never expire."
							)}
						</span>
					</InputContainer>
				</form>
			</ModelContentContainer>
		</Modal>
	);
}

export default CreateInviteModal;
