import {
  APIChannel,
  APIInvite,
  APIOverwrite,
  APIReadState,
  APIUser,
  APIWebhook,
  GatewayVoiceState,
  Snowflake,
} from '@puyodead1/fosscord-api-types/v9';
import {action, makeObservable, observable} from 'mobx';
import BaseStore from '../BaseStore';
import MessageStore from '../MessageStore';

export default class Channel extends BaseStore {
  id: Snowflake;
  createdAt: Date;
  @observable name?: string;
  @observable icon?: string | null;
  type: number;
  @observable recipients?: APIUser[];
  @observable lastMessageId?: Snowflake;
  guildId?: Snowflake;
  @observable parentId: Snowflake;
  ownerId?: Snowflake;
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
  @observable messages = new MessageStore();
  @observable voiceStates?: GatewayVoiceState[];
  @observable readStates?: APIReadState[];
  @observable webhooks?: APIWebhook[];
  @observable flags: number;
  @observable defaultThreadRateLimitPerUser: number;

  constructor(channel: APIChannel) {
    super();

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
    this.defaultThreadRateLimitPerUser =
      channel.default_thread_rate_limit_per_user;

    if (channel.messages) {
      this.messages.addAll(channel.messages);
    }

    makeObservable(this);
  }

  @action
  update(data: APIChannel) {
    Object.assign(this, data);
  }
}
