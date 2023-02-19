import {
	APIChannel,
	APIInvite,
	APIOverwrite,
	APIReadState,
	APIUser,
	APIWebhook,
	ChannelType,
	GatewayVoiceState,
	RESTGetAPIChannelMessagesResult,
} from "@puyodead1/fosscord-api-types/v9";
import { action, observable } from "mobx";
import { Routes } from "../utils/Endpoints";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";
import MessagesStore from "./MessagesStore";

export default class Channel extends BaseStore {
	private readonly domain: DomainStore;

	id: string;
	@observable created_at: string;
	@observable name?: string;
	@observable icon?: string | null;
	type: ChannelType;
	@observable recipients?: APIUser[];
	@observable last_message_id?: string;
	@observable guild_id?: string;
	@observable parent_id: string;
	@observable owner_id?: string;
	@observable last_pin_timestamp?: number;
	@observable default_auto_archive_duration?: number;
	@observable position: number;
	@observable permission_overwrites?: APIOverwrite[];
	@observable video_quality_mode?: number;
	@observable bitrate?: number;
	@observable user_limit?: number;
	@observable nsfw: boolean;
	@observable rate_limit_per_user?: number;
	@observable topic?: string;
	@observable invites?: APIInvite[];
	@observable retention_policy_id?: string;
	@observable voice_states?: GatewayVoiceState[];
	@observable read_states?: APIReadState[];
	@observable webhooks?: APIWebhook[];
	@observable flags: number;
	@observable default_thread_rate_limit_per_user: number;
	@observable channelIcon?: string;

	@observable messages: MessagesStore;
	private hasFetchedMessages: boolean = false;

	constructor(domain: DomainStore, data: APIChannel) {
		super();
		this.domain = domain;
		this.messages = new MessagesStore(domain);

		this.id = data.id;
		this.created_at = data.created_at;
		this.name = data.name;
		this.icon = data.icon;
		this.type = data.type;
		this.recipients = data.recipients;
		this.last_message_id = data.last_message_id;
		this.guild_id = data.guild_id;
		this.parent_id = data.parent_id;
		this.owner_id = data.owner_id;
		this.last_pin_timestamp = data.last_pin_timestamp;
		this.default_auto_archive_duration = data.default_auto_archive_duration;
		this.position = data.position ?? 0;
		this.permission_overwrites = data.permission_overwrites;
		this.video_quality_mode = data.video_quality_mode;
		this.bitrate = data.bitrate;
		this.user_limit = data.user_limit;
		this.nsfw = data.nsfw;
		this.rate_limit_per_user = data.rate_limit_per_user;
		this.topic = data.topic;
		this.invites = data.invites;
		this.retention_policy_id = data.retention_policy_id;
		if (data.messages) this.messages.addAll(data.messages);
		this.voice_states = data.voice_states;
		this.read_states = data.read_states;
		this.webhooks = data.webhooks;
		this.flags = data.flags;
		this.default_thread_rate_limit_per_user =
			data.default_thread_rate_limit_per_user;

		switch (this.type) {
			case ChannelType.GuildText:
				this.channelIcon = "pound";
				break;
			case ChannelType.GuildVoice:
				this.channelIcon = "volume-high";
				break;
			case ChannelType.GuildAnnouncement:
			case ChannelType.AnnouncementThread:
				this.channelIcon = "bullhorn-variant";
				break;
			case ChannelType.GuildStore:
			case ChannelType.Transactional:
				this.channelIcon = "tag";
				break;
			case ChannelType.Encrypted:
			case ChannelType.EncryptedThread:
				this.channelIcon = "message-lock";
				break;
			case ChannelType.PublicThread:
			case ChannelType.PrivateThread:
				this.channelIcon = "comment-text-multiple";
				break;
			case ChannelType.GuildStageVoice:
				this.channelIcon = "broadcast";
				break;
			case ChannelType.GuildForum:
				this.channelIcon = "forum";
				break;
			case ChannelType.TicketTracker:
				this.channelIcon = "ticket-outline";
				break;
			case ChannelType.KanBan:
				this.channelIcon = "developer-board";
				break;
			case ChannelType.VoicelessWhiteboard:
				this.channelIcon = "draw";
				break;
		}

		if (data.messages) this.messages.addAll(data.messages);
	}

	@action
	async getChannelMessages(domain: DomainStore, limit?: number) {
		if (this.hasFetchedMessages) return;

		this.logger.info(`Fetching messags for ${this.id}`);
		const messages = await domain.rest.get<RESTGetAPIChannelMessagesResult>(
			Routes.channelMessages(this.id),
			{
				limit: limit || 50,
			},
		);
		this.messages.addAll(
			messages.filter((x) => !this.messages.has(x.id)).reverse(),
			// .sort((a, b) => {
			//   const aTimestamp = new Date(a.timestamp as unknown as string);
			//   const bTimestamp = new Date(b.timestamp as unknown as string);
			//   return aTimestamp.getTime() - bTimestamp.getTime();
			// })
		);
		this.hasFetchedMessages = true;
	}
}
