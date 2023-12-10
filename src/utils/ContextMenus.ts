import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import { IContextMenuItem } from "../components/ContextMenuItem";
import AccountStore from "../stores/AccountStore";
import AppStore from "../stores/AppStore";
import Guild from "../stores/objects/Guild";
import GuildMember from "../stores/objects/GuildMember";
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
			{
				label: "Copy Raw Text",
				onClick: () => {
					navigator.clipboard.writeText(message.content);
				},
				iconProps: {
					icon: "mdiRaw",
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
	// TODO: check if target has higher role
	Member: (me: AccountStore, them: GuildMember, guild?: Guild): IContextMenuItem[] => {
		const permissions = Permissions.getPermission(me.id, guild);

		const items: IContextMenuItem[] = [];

		// if (permissions.has("KICK_MEMBERS")) {
		// 	items.push({
		// 		label: `Kick ${them.user!.username}`,
		// 		onClick: () => {
		// 			// openModal(KickModal, {
		// 			// 	member: them,
		// 			// });
		// 		},
		// 		color: "red",
		// 		hover: {
		// 			backgroundColor: "red",
		// 			color: "white",
		// 		},
		// 	});
		// }

		// if (permissions.has("BAN_MEMBERS")) {
		// 	items.push({
		// 		label: `Ban ${them.user!.username}`,
		// 		onClick: () => {
		// 			// member.kick()
		// 			console.log("ban member");
		// 		},
		// 		color: "red",
		// 		hover: {
		// 			backgroundColor: "red",
		// 			color: "white",
		// 		},
		// 	});
		// }

		return items;
	},
	// TODO: check if target has higher role
	Member2: (app: AppStore, them: User, guildId: string): IContextMenuItem[] => {
		const me = app.account!;
		const guild = app.guilds.get(guildId);
		if (!guild) return [];
		const member = guild.members.get(them.id);
		if (!member) return [];
		const permissions = Permissions.getPermission(me.id, guild);

		const items: IContextMenuItem[] = [];

		if (permissions.has("KICK_MEMBERS")) {
			items.push({
				label: `Kick ${them.username}`,
				onClick: () => {
					// openModal(KickModal, {
					// 	member,
					// });
				},
				color: "red",
				hover: {
					backgroundColor: "red",
					color: "white",
				},
			});
		}

		if (permissions.has("BAN_MEMBERS")) {
			items.push({
				label: `Ban ${them.username}`,
				onClick: () => {
					// member.kick()
					console.log("ban member");
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
};
