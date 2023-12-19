import { Routes } from "@spacebarchat/spacebar-api-types/v9";
import { useState } from "react";
import { ModalProps, modalController } from "../../controllers/modals";
import { useAppStore } from "../../stores/AppStore";
import { Modal } from "./ModalComponents";

export function LeaveServerModal({ target, ...props }: ModalProps<"leave_server">) {
	const app = useAppStore();
	const [isDisabled, setDisabled] = useState(false);

	async function leaveGuild() {
		setDisabled(true);
		await app.rest
			.delete(Routes.guildMember(target.id, "@me"))
			.then(() => {
				modalController.pop("close");
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(() => setDisabled(false));
	}

	return (
		<Modal
			{...props}
			title={`Leave '${target.name}'`}
			description={
				<span>
					Are you sure you want to leave <b>{target.name}</b>? You won't be able to rejoin this guild unless
					you are re-invited.
				</span>
			}
			actions={[
				{
					onClick: leaveGuild,
					children: <span>Leave Server</span>,
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
		/>
	);
}
