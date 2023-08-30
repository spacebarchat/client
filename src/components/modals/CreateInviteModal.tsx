import { useModals } from "@mattjennings/react-modal-stack";
import { APIInvite, Routes } from "@spacebarchat/spacebar-api-types/v9";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import { messageFromFieldError } from "../../utils/messageFromFieldError";
import { Input, InputErrorText, InputLabel, LabelWrapper } from "../AuthComponents";
import { TextDivider } from "../Divider";
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
	channel_id: string;
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

	const guild = app.guilds.get(props.guild_id);
	const channel = guild?.channels.get(props.channel_id) ?? guild?.channels.getAll()[0];

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
						max_age: undefined,
						max_uses: undefined,
						temporary: false,
					},
					data,
					{ code: undefined },
				),
			)
			.then((r) => {
				setValue("code", `${window.location.origin}/invite/${r.code}`);
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
	});

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
				<ModalHeaderText>Inviting people</ModalHeaderText>
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
							<Input {...register("max_age", { value: 0 })} onChange={onSubmit} type="number" />
						</InputWrapper>
					</InputContainer>

					<InputContainer>
						<LabelWrapper error={false}>
							<InputLabel>Maximum Uses</InputLabel>
						</LabelWrapper>
						<InputWrapper>
							<Input {...register("max_uses", { value: 0 })} onChange={onSubmit} type="number" />
						</InputWrapper>
					</InputContainer>

					<InputContainer>
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
						<InputWrapper>
							<Input
								autoFocus
								{...register("code")}
								readOnly={true}
								placeholder={`${window.location.origin}/invite/`}
							/>

							<IconButton
								onClick={(e) => {
									e.preventDefault();
									navigator.clipboard.writeText(getValues("code"));
								}}
							>
								<Icon icon="mdiContentCopy" size="20px" color="white" />
							</IconButton>
						</InputWrapper>
					</InputContainer>
				</form>
			</ModelContentContainer>
		</Modal>
	);
}

export default CreateInviteModal;
