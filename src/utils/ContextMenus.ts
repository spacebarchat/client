import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import { IContextMenuItem } from "../components/ContextMenuItem";
import AccountStore from "../stores/AccountStore";
import { MessageLike } from "../stores/objects/Message";
import User from "../stores/objects/User";

export default {
	User: (user: User | AccountStore): IContextMenuItem => {
		return {
			label: "Copy User ID",
			onClick: () => {
				navigator.clipboard.writeText(user.id);
			},
			iconProps: {
				icon: "mdiIdentifier",
			},
		};
	},
	Message: (message: MessageLike): IContextMenuItem => {
		return {
			label: "Copy Message ID",
			onClick: () => {
				navigator.clipboard.writeText(message.id);
			},
			iconProps: {
				icon: "mdiIdentifier",
			},
		};
	},
	MessageAttachment: (attachment: APIAttachment): IContextMenuItem => {
		return {
			label: "Copy Attachment URL",
			onClick: () => {
				navigator.clipboard.writeText(attachment.url);
			},
			iconProps: {
				icon: "mdiLink",
			},
		};
	},
};
