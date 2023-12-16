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

export function BanMemberModal({ target, ...props }: ModalProps<"ban_member">) {
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
			title={`Ban '${target.user?.username}'`}
			description={
				<DescriptionText>
					Are you sure you want to ban <b>@{target.user?.username}</b>? They won't be able to rejoin unless
					they are unbanned.
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
			<img
				src="https://media1.tenor.com/m/TG5OF7UkLasAAAAd/thanos-infinity.gif"
				loading="lazy"
				alt="Thanos Snap GIF"
				height={300}
				style={{
					objectFit: "contain",
				}}
			/>
			<span>reason form</span>
		</Modal>
	);
}
