import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import { IContextMenuItem } from "../components/ContextMenuItem";
import AccountStore from "../stores/AccountStore";
import AppStore from "../stores/AppStore";
import { MessageLike } from "../stores/objects/Message";
import User from "../stores/objects/User";
import { Permissions } from "./Permissions";

export default {
	User: (user: User | AccountStore): IContextMenuItem[] => {
		return [
			{
				label: "Copy User ID",
				onClick: () => {
					navigator.clipboard.writeText(user.id);
				},
				iconProps: {
					icon: "mdiIdentifier",
				},
			},
		];
	},
	Message: (app: AppStore, message: MessageLike, account: AccountStore | null): IContextMenuItem[] => {
		const channel = app.channels.get(message.channel_id);
		const permissions = Permissions.getPermission(account?.id, channel?.guild, channel);
		const canDeleteMessage = permissions.has("MANAGE_MESSAGES") || message.author.id === account?.id;

		const items: IContextMenuItem[] = [
			{
				label: "Copy Message ID",
				onClick: () => {
					navigator.clipboard.writeText(message.id);
				},
				iconProps: {
					icon: "mdiIdentifier",
				},
			},
		];

		if (canDeleteMessage) {
			items.push({
				label: "Delete Message",
				onClick: () => {
					message.delete();
				},
				iconProps: {
					icon: "mdiTrashCanOutline",
					color: "red",
				},
				color: "red",
				hover: {
					backgroundColor: "red",
					color: "white",
				},
			});
		}

		return items;
	},
	MessageAttachment: (attachment: APIAttachment): IContextMenuItem[] => {
		return [
			{
				label: "Copy Attachment URL",
				onClick: () => {
					navigator.clipboard.writeText(attachment.url);
				},
				iconProps: {
					icon: "mdiLink",
				},
			},
		];
	},
};
