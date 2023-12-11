import { APIInvite, Routes } from "@spacebarchat/spacebar-api-types/v9";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { ModalProps } from "../../controllers/modals/types";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import { messageFromFieldError } from "../../utils/messageFromFieldError";
import { Input, InputErrorText, InputLabel, LabelWrapper } from "../AuthComponents";
import Button from "../Button";
import { TextDivider } from "../Divider";
import { InputSelect, InputSelectOption } from "../FormComponents";
import Icon from "../Icon";
import IconButton from "../IconButton";
import { InputContainer, Modal } from "./ModalComponents";

// TODO: refactor the layout of this modal when we have dms and friends, and move settings to a separate modal

type Option = { label: string; value: number };

enum EExpiry {
	MINUTES_30 = "MINUTES_30",
	HOUR_1 = "HOUR_1",
	HOURS_6 = "HOURS_6",
	HOURS_12 = "HOURS_12",
	DAY_1 = "DAY_1",
	DAY_7 = "DAY_7",
	DAYS_30 = "DAYS_30",
	NEVER = "NEVER",
}

enum EMaxUses {
	NO_LIMIT = "NO_LIMIT",
	ONE = "USE_1",
	FIVE = "USE_5",
	TEN = "USE_10",
	TWENTY_FIVE = "USE_25",
	FIFTY = "USE_50",
	ONE_HUNDRED = "USE_100",
}

const ExpiryOptions: Record<EExpiry, Option> = {
	[EExpiry.MINUTES_30]: { label: "30 Minutes", value: 1800 },
	[EExpiry.HOUR_1]: { label: "1 Hour", value: 3600 },
	[EExpiry.HOURS_6]: { label: "6 Hours", value: 21600 },
	[EExpiry.HOURS_12]: { label: "12 Hours", value: 43200 },
	[EExpiry.DAY_1]: { label: "1 Day", value: 86400 },
	[EExpiry.DAY_7]: { label: "7 Days", value: 604800 },
	[EExpiry.DAYS_30]: { label: "30 Days", value: 2592000 },
	[EExpiry.NEVER]: { label: "Never", value: 0 },
};

const MaxUsesOptions: Record<EMaxUses, Option> = {
	[EMaxUses.NO_LIMIT]: { label: "No Limit", value: 0 },
	[EMaxUses.ONE]: { label: "1 use", value: 1 },
	[EMaxUses.FIVE]: { label: "5 uses", value: 5 },
	[EMaxUses.TEN]: { label: "10 uses", value: 10 },
	[EMaxUses.TWENTY_FIVE]: { label: "25 uses", value: 25 },
	[EMaxUses.FIFTY]: { label: "50 uses", value: 50 },
	[EMaxUses.ONE_HUNDRED]: { label: "100 uses", value: 100 },
};

function findOptionByValue(value: number, options: Record<string, Option>): Option | undefined {
	const result = Object.values(options).find((option) => option.value === value);
	return result;
}

const InputWrapper = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
`;

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

function CreateInviteModal({ target, ...props }: ModalProps<"create_invite">) {
	const logger = useLogger("CreateInviteModal");
	const app = useAppStore();
	const [maxAge, setMaxAge] = React.useState(ExpiryOptions.DAY_7);
	const [maxUses, setMaxUses] = React.useState(MaxUsesOptions.NO_LIMIT);
	const [isEdited, setIsEdited] = React.useState(false);
	const [inviteExpiresAt, setInviteExpiresAt] = React.useState<Date | null>(null);

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
				Routes.channelInvites(target.id),
				Object.assign(
					{
						flags: 0,
						target_type: null,
						target_user_id: null,
						max_age: ExpiryOptions.DAY_7.value,
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
		setMaxAge(findOptionByValue(Number(e.target.value), ExpiryOptions) ?? ExpiryOptions.DAY_7);
		setIsEdited(true);
	};

	const handleMaxUsesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setMaxUses(findOptionByValue(Number(e.target.value), MaxUsesOptions) ?? MaxUsesOptions.NO_LIMIT);
		setIsEdited(true);
	};

	React.useEffect(() => createCode(), []);

	return (
		<Modal {...props} title="Invite People" description={`to #${target.name} in ${target.guild?.name}`}>
			<form
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						onSubmit();
					}
				}}
			>
				<InputContainer>
					<LabelWrapper error={false}>
						<InputLabel>Expire after</InputLabel>
					</LabelWrapper>
					<InputWrapper>
						<InputSelect
							{...register("max_age", { value: ExpiryOptions.DAY_7.value })}
							onChange={handleAgeChange}
							value={maxAge.value}
						>
							{Object.entries(ExpiryOptions).map(([_, b]) => (
								<InputSelectOption value={b.value}>{b.label}</InputSelectOption>
							))}
						</InputSelect>
					</InputWrapper>
				</InputContainer>

				<InputContainer>
					<LabelWrapper error={false}>
						<InputLabel>Max Number of Uses</InputLabel>
					</LabelWrapper>
					<InputWrapper>
						<InputSelect
							{...register("max_uses", { value: 0 })}
							onChange={handleMaxUsesChange}
							value={maxUses.value}
						>
							{Object.entries(MaxUsesOptions).map(([_, b]) => (
								<InputSelectOption value={b.value}>{b.label}</InputSelectOption>
							))}
						</InputSelect>
					</InputWrapper>
				</InputContainer>

				<div style={{ display: "flex", justifyContent: "flex-end", margin: "24px 0 12px 0" }}>
					<Button disabled={!isEdited} onClick={onSubmit}>
						Generate New Link
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
							<>This invite will expire {dayjs(inviteExpiresAt).fromNow()}</>
						) : (
							"Invite will never expire."
						)}
					</span>
				</InputContainer>
			</form>
		</Modal>
	);
}

export default CreateInviteModal;
