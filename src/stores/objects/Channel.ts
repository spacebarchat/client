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
import {action, makeObservable} from 'mobx';
import BaseStore from '../BaseStore';
import MessageStore from '../MessageStore';

export default class Channel extends BaseStore {
  id: Snowflake;
  created_at: string;
  name?: string;
  icon?: string | null;
  type: number;
  recipients?: APIUser[];
  last_message_id?: Snowflake;
  guild_id?: Snowflake;
  parent_id: Snowflake;
  owner_id?: Snowflake;
  last_pin_timestamp?: number;
  default_auto_archive_duration?: number;
  position?: number;
  permission_overwrites?: APIOverwrite[];
  video_quality_mode?: number;
  bitrate?: number;
  user_limit?: number;
  nsfw: boolean;
  rate_limit_per_user?: number;
  topic?: string;
  invites?: APIInvite[];
  retention_policy_id?: string;
  messages = new MessageStore();
  voice_states?: GatewayVoiceState[];
  read_states?: APIReadState[];
  webhooks?: APIWebhook[];
  flags: number;
  default_thread_rate_limit_per_user: number;

  constructor(channel: APIChannel) {
    super();

    this.id = channel.id;
    this.created_at = channel.created_at;
    this.name = channel.name;
    this.icon = channel.icon;
    this.type = channel.type;
    this.recipients = channel.recipients;
    this.last_message_id = channel.last_message_id;
    this.guild_id = channel.guild_id;
    this.parent_id = channel.parent_id;
    this.owner_id = channel.owner_id;
    this.last_pin_timestamp = channel.last_pin_timestamp;
    this.default_auto_archive_duration = channel.default_auto_archive_duration;
    this.position = channel.position;
    this.permission_overwrites = channel.permission_overwrites;
    this.video_quality_mode = channel.video_quality_mode;
    this.bitrate = channel.bitrate;
    this.user_limit = channel.user_limit;
    this.nsfw = channel.nsfw;
    this.rate_limit_per_user = channel.rate_limit_per_user;
    this.topic = channel.topic;
    this.invites = channel.invites;
    this.retention_policy_id = channel.retention_policy_id;
    this.voice_states = channel.voice_states;
    this.read_states = channel.read_states;
    this.webhooks = channel.webhooks;
    this.flags = channel.flags;
    this.default_thread_rate_limit_per_user =
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
