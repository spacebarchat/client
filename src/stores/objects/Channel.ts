import * as Icons from "@mdi/js";
import type {
	APIChannel,
	APIInvite,
	APIOverwrite,
	APIReadState,
	APIUser,
	APIWebhook,
	GatewayVoiceState,
	RESTGetAPIChannelMessagesQuery,
	RESTGetAPIChannelMessagesResult,
	RESTPostAPIChannelMessageJSONBody,
	RESTPostAPIChannelMessageResult,
	Snowflake as SnowflakeType,
} from "@spacebarchat/spacebar-api-types/v9";
import { ChannelType, Routes } from "@spacebarchat/spacebar-api-types/v9";
import { action, computed, makeObservable, observable } from "mobx";
import Logger from "../../utils/Logger";
import { APIError } from "../../utils/interfaces/api";
import AppStore from "../AppStore";
import MessageStore from "../MessageStore";
import QueuedMessage from "./QueuedMessage";

export default class Channel {
	private readonly logger: Logger = new Logger("Channel");
	private readonly app: AppStore;

	id: SnowflakeType;
	createdAt: Date;
	@observable name?: string;
	@observable icon?: string | null;
	type: number;
	@observable recipients?: APIUser[];
	@observable lastMessageId?: SnowflakeType;
	guildId?: SnowflakeType;
	@observable parentId: SnowflakeType;
	ownerId?: SnowflakeType;
	@observable lastPinTimestamp?: number;
	@observable defaultAutoArchiveDuration?: number;
	@observable position?: number;
	@observable permissionOverwrites?: APIOverwrite[];
	@observable videoQualityMode?: number;
	@observable bitrate?: number;
	@observable userLimit?: number;
	@observable nsfw: boolean;
	@observable rateLimiTPerUser?: number;
	@observable topic?: string;
	@observable invites?: APIInvite[];
	@observable retentionPolicyId?: string;
	@observable messages: MessageStore;
	@observable voiceStates?: GatewayVoiceState[];
	@observable readStates?: APIReadState[];
	@observable webhooks?: APIWebhook[];
	@observable flags: number;
	@observable defaultThreadRateLimitPerUser: number;
	@observable channelIcon?: keyof typeof Icons;
	private hasFetchedMessages = false;

	constructor(app: AppStore, channel: APIChannel) {
		this.app = app;

		this.id = channel.id;
		this.createdAt = new Date(channel.created_at);
		this.name = channel.name;
		this.icon = channel.icon;
		this.type = channel.type;
		this.recipients = channel.recipients;
		this.lastMessageId = channel.last_message_id;
		this.guildId = channel.guild_id;
		this.parentId = channel.parent_id;
		this.ownerId = channel.owner_id;
		this.lastPinTimestamp = channel.last_pin_timestamp;
		this.defaultAutoArchiveDuration = channel.default_auto_archive_duration;
		this.position = channel.position;
		this.permissionOverwrites = channel.permission_overwrites;
		this.videoQualityMode = channel.video_quality_mode;
		this.bitrate = channel.bitrate;
		this.userLimit = channel.user_limit;
		this.nsfw = channel.nsfw;
		this.rateLimiTPerUser = channel.rate_limit_per_user;
		this.topic = channel.topic;
		this.invites = channel.invites;
		this.retentionPolicyId = channel.retention_policy_id;
		this.voiceStates = channel.voice_states;
		this.readStates = channel.read_states;
		this.webhooks = channel.webhooks;
		this.flags = channel.flags;
		this.defaultThreadRateLimitPerUser = channel.default_thread_rate_limit_per_user;

		this.messages = new MessageStore(app, this.id);

		if (channel.messages) {
			this.messages.addAll(channel.messages);
		}

		switch (this.type) {
			case ChannelType.GuildText:
				this.channelIcon = "mdiPound";
				break;
			case ChannelType.GuildVoice:
				this.channelIcon = "mdiVolumeHigh";
				break;
			case ChannelType.GuildAnnouncement:
			case ChannelType.AnnouncementThread:
				this.channelIcon = "mdiBullhornVariant";
				break;
			case ChannelType.GuildStore:
			case ChannelType.Transactional:
				this.channelIcon = "mdiStore";
				break;
			case ChannelType.Encrypted:
			case ChannelType.EncryptedThread:
				this.channelIcon = "mdiLock";
				break;
			case ChannelType.PublicThread:
			case ChannelType.PrivateThread:
				this.channelIcon = "mdiCommentMultipleOutline";
				break;
			case ChannelType.GuildStageVoice:
				this.channelIcon = "mdiBroadcast";
				break;
			case ChannelType.GuildForum:
				this.channelIcon = "mdiForumOutline";
				break;
			case ChannelType.TicketTracker:
				this.channelIcon = "mdiTicketOutline";
				break;
			case ChannelType.KanBan:
				this.channelIcon = "mdiDeveloperBoard";
				break;
			case ChannelType.VoicelessWhiteboard:
				this.channelIcon = "mdiDraw";
				break;
			case ChannelType.GuildDirectory:
				this.channelIcon = "mdiFolder";
				break;
		}

		makeObservable(this);
	}

	@action
	update(data: APIChannel) {
		Object.assign(this, data);
	}

	@action
	getMessages(
		app: AppStore,
		isInitial: boolean,
		limit?: number,
		before?: SnowflakeType,
		after?: SnowflakeType,
		around?: SnowflakeType,
	): Promise<number> {
		return new Promise((resolve, reject) => {
			if (isInitial && this.hasFetchedMessages) {
				return;
			}

			let opts: RESTGetAPIChannelMessagesQuery = {
				limit: limit || 50,
			};

			if (before) {
				opts = { ...opts, before };
			}
			if (after) {
				opts = { ...opts, after };
			}
			if (around) {
				opts = { ...opts, around };
			}

			this.hasFetchedMessages = true;
			this.logger.info(`Fetching messags for ${this.id}`);
			app.rest
				.get<RESTGetAPIChannelMessagesResult | APIError>(Routes.channelMessages(this.id), opts)
				.then((res) => {
					if ("code" in res) {
						this.logger.error(res);
						return;
					}
					this.messages.addAll(
						res.filter((x) => !this.messages.has(x.id)),
						// .sort((a, b) => {
						//   const aTimestamp = new Date(a.timestamp as unknown as string);
						//   const bTimestamp = new Date(b.timestamp as unknown as string);
						//   return aTimestamp.getTime() - bTimestamp.getTime();
						// })
					);
					resolve(res.length);
				})
				.catch((err) => {
					this.logger.error(err);
					reject(err);
				});
		});
	}

	@action
	async sendMessage(data: RESTPostAPIChannelMessageJSONBody | FormData, msg?: QueuedMessage) {
		if (data instanceof FormData)
			return this.app.rest.postFormData<RESTPostAPIChannelMessageResult>(
				Routes.channelMessages(this.id),
				data,
				undefined,
				msg,
			);
		return this.app.rest.post<RESTPostAPIChannelMessageJSONBody, RESTPostAPIChannelMessageResult>(
			Routes.channelMessages(this.id),
			data,
		);
	}

	canSendMessage(content: string, attachments: File[]) {
		if (!attachments.length && (!content || !content.trim() || !content.replace(/\r?\n|\r/g, ""))) {
			return false;
		}

		return true;
	}

	@computed
	get isTextChannel() {
		return (
			this.type === ChannelType.GuildText ||
			this.type === ChannelType.GuildVoice ||
			this.type === ChannelType.GuildStageVoice ||
			this.type === ChannelType.GuildForum ||
			this.type === ChannelType.GuildAnnouncement ||
			this.type === ChannelType.AnnouncementThread ||
			this.type === ChannelType.Encrypted ||
			this.type === ChannelType.EncryptedThread ||
			this.type === ChannelType.PrivateThread ||
			this.type === ChannelType.PublicThread ||
			this.type === ChannelType.GroupDM ||
			this.type === ChannelType.DM
		);
	}
}
