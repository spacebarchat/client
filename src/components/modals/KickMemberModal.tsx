import { ModalProps, modalController } from "@/controllers/modals";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppStore } from "@hooks/useAppStore";
import { Routes } from "@spacebarchat/spacebar-api-types/v9";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import { Modal } from "./ModalComponents";

const DescriptionText = styled.p`
	font-size: 16px;
	font-weight: var(--font-weight-regular);
	color: var(--text-header-secondary);
	margin-top: 8px;
`;

const TextArea = styled.textarea`
	flex: 1;
	padding: 8px;
	border-radius: 4px;
	background-color: var(--background-secondary-alt);
	border: none;
	color: var(--text);
	font-size: 16px;
	font-weight: var(--font-weight-regular);
	resize: none;
	outline: none;
`;

const schema = yup
	.object({
		reason: yup.string().max(512, "Reason must be less than 512 characters"),
	})
	.required();

export function KickMemberModal({ target, ...props }: ModalProps<"kick_member">) {
	const app = useAppStore();
	const {
		register,
		control,
		handleSubmit,
		formState: { disabled, isLoading, isSubmitting },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const isDisabled = disabled || isLoading || isSubmitting;

	const onSubmit = handleSubmit((data) => {
		app.rest
			.delete(
				Routes.guildMember(target.guild.id, target.user!.id),
				undefined,
				data.reason
					? {
							"X-Audit-Log-Reason": data.reason,
					  }
					: undefined,
			)
			.then(() => {
				modalController.pop("close");
			})
			.catch((e) => {
				console.error(e);
			});
	});

	return (
		<Modal
			{...props}
			title={`Kick ${target.user?.username} from Guild`}
			description={
				<DescriptionText>
					Are you sure you want to kick <b>@{target.user?.username}</b> from the guild? They will be able to
					rejoin again with a new invite.
				</DescriptionText>
			}
			actions={[
				{
					onClick: onSubmit,
					children: <span>Kick</span>,
					palette: "danger",
					confirmation: true,
					disabled: isDisabled,
					size: "small",
				},
				{
					onClick: () => modalController.pop("close"),
					children: <span>Cancel</span>,
					palette: "link",
					disabled: isDisabled,
					size: "small",
				},
			]}
		>
			<TextArea {...register("reason")} id="reason" name="reason" placeholder="Reason" maxLength={512} />
		</Modal>
	);
}
