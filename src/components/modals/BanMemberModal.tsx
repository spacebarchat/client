import { yupResolver } from "@hookform/resolvers/yup";
import { Routes } from "@spacebarchat/spacebar-api-types/v9";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import { ModalProps, modalController } from "../../controllers/modals";
import { useAppStore } from "../../stores/AppStore";
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

export function BanMemberModal({ target, type, ...props }: ModalProps<"ban_member">) {
	const app = useAppStore();
	const {
		register,
		handleSubmit,
		formState: { disabled, isLoading, isSubmitting },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const isDisabled = disabled || isLoading || isSubmitting;

	const onSubmit = handleSubmit((data) => {
		app.rest
			.put(
				Routes.guildBan(target.guild.id, target.user!.id),
				undefined,
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
			title={`Ban '${target.user?.username}'`}
			description={
				<DescriptionText>
					Are you sure you want to ban <b>@{target.user?.username}</b>? They won't be able to rejoin unless
					they are unbanned.
				</DescriptionText>
			}
			actions={[
				{
					onClick: onSubmit,
					children: <span>Ban</span>,
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
			<img
				src="https://media1.tenor.com/m/TG5OF7UkLasAAAAd/thanos-infinity.gif"
				loading="lazy"
				alt="Thanos Snap GIF"
				height={300}
				style={{
					marginBottom: 20,
					borderRadius: 8,
				}}
			/>

			<TextArea {...register("reason")} id="reason" name="reason" placeholder="Reason" maxLength={512} />
		</Modal>
	);
}
