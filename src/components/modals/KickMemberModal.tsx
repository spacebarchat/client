import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import { ModalProps, modalController } from "../../controllers/modals";
import { Modal } from "./ModalComponents";

const DescriptionText = styled.p`
	font-size: 16px;
	font-weight: var(--font-weight-regular);
	color: var(--text-header-secondary);
	margin-top: 8px;
`;

const schema = yup
	.object({
		reason: yup.string(),
	})
	.required();

export function KickMemberModal({ target, ...props }: ModalProps<"kick_member">) {
	const {
		register,
		control,
		setError,
		handleSubmit,
		formState: { errors, disabled, isLoading, isSubmitting },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const isDisabled = disabled || isLoading || isSubmitting;

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
					onClick: () => console.log("kick"),
					children: <span>Kick</span>,
					palette: "danger",
					confirmation: true,
					disabled: isDisabled,
				},
				{
					onClick: () => modalController.pop("close"),
					children: <span>Cancel</span>,
					palette: "link",
					disabled: isDisabled,
				},
			]}
		>
			<span>reason form</span>
		</Modal>
	);
}
