import { useModals } from "@mattjennings/react-modal-stack";
import { Routes } from "@spacebarchat/spacebar-api-types/v9";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { modalController } from "../../controllers/modals/ModalController";
import { ModalProps } from "../../controllers/modals/types";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import { messageFromFieldError } from "../../utils/messageFromFieldError";
import { Input, InputErrorText, InputLabel, LabelWrapper } from "../AuthComponents";
import { TextDivider } from "../Divider";
import { Modal } from "./ModalComponents";

export const ModalHeader = styled.div`
	padding: 16px;
`;

const InviteInputContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

type FormValues = {
	code: string;
};

function JoinServerModal({ ...props }: ModalProps<"join_server">) {
	const logger = useLogger("JoinServerModal");
	const { openModal, closeAllModals } = useModals();
	const app = useAppStore();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isLoading },
		setError,
		setValue,
	} = useForm<FormValues>();

	const onSubmit = handleSubmit((data) => {
		const code = data.code.split("/").reverse()[0];

		app.rest
			.post<never, { guild_id: string; channel_id: string }>(Routes.invite(code))
			.then((r) => {
				navigate(`/channels/${r.guild_id}/${r.channel_id}`);
				closeAllModals();
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
	});

	return (
		<Modal
			{...props}
			title="Join a Guild"
			description="Enter an invite below to join an existing guild."
			actions={[
				{
					onClick: onSubmit,
					children: <span>Join</span>,
					palette: "primary",
					confirmation: true,
					disabled: isLoading,
				},
				{
					onClick: () => modalController.pop("close"),
					children: <span>Back</span>,
					palette: "link",
					disabled: isLoading,
				},
			]}
		>
			<form
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						onSubmit();
					}
				}}
			>
				<InviteInputContainer>
					<LabelWrapper error={!!errors.code}>
						<InputLabel>Invite Link</InputLabel>

						{errors.code && (
							<InputErrorText>
								<>
									<TextDivider>-</TextDivider>
									{errors.code.message}
								</>
							</InputErrorText>
						)}
					</LabelWrapper>
					<Input
						{...register("code", { required: true })}
						placeholder={`${window.location.origin}/invite/`}
						type="text"
						maxLength={9999}
						required
						error={!!errors.code}
						disabled={isLoading}
						autoFocus
						minLength={6}
					/>
				</InviteInputContainer>
			</form>
		</Modal>
	);
}

export default JoinServerModal;
