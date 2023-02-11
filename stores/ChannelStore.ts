import {
  Channel,
  ChannelPermissionOverwrite,
  ChannelType,
  Guild,
  Invite,
  Message,
  ReadState,
  Recipient,
  User,
  VoiceState,
  Webhook,
} from "@puyodead1/fosscord-types";
import { observable } from "mobx";
import BaseStore from "./BaseStore";

export default class ChannelStore extends BaseStore implements Channel {
  id: string;
  created_at: Date;
  @observable name?: string | undefined;
  @observable icon?: string | null | undefined;
  type: ChannelType;
  recipients?: Recipient[] | undefined;
  last_message_id?: string | undefined;
  guild_id?: string | undefined;
  guild: Guild;
  parent_id: string;
  parent?: Channel | undefined;
  owner_id?: string | undefined;
  owner: User;
  last_pin_timestamp?: number | undefined;
  default_auto_archive_duration?: number | undefined;
  position?: number | undefined;
  permission_overwrites?: ChannelPermissionOverwrite[] | undefined;
  video_quality_mode?: number | undefined;
  bitrate?: number | undefined;
  user_limit?: number | undefined;
  nsfw: boolean;
  rate_limit_per_user?: number | undefined;
  topic?: string | undefined;
  invites?: Invite[] | undefined;
  retention_policy_id?: string | undefined;
  messages?: Message[] | undefined;
  voice_states?: VoiceState[] | undefined;
  read_states?: ReadState[] | undefined;
  webhooks?: Webhook[] | undefined;
  flags: number;
  default_thread_rate_limit_per_user: number;

  constructor(data: Channel) {
    super();
    // super({ logStoreCreated: false });

    this.id = data.id;
    this.created_at = data.created_at;
    this.name = data.name;
    this.icon = data.icon;
    this.type = data.type;
    this.recipients = data.recipients;
    this.last_message_id = data.last_message_id;
    this.guild_id = data.guild_id;
    this.guild = data.guild;
    this.parent_id = data.parent_id;
    this.parent = data.parent;
    this.owner_id = data.owner_id;
    this.owner = data.owner;
    this.last_pin_timestamp = data.last_pin_timestamp;
    this.default_auto_archive_duration = data.default_auto_archive_duration;
    this.position = data.position;
    this.permission_overwrites = data.permission_overwrites;
    this.video_quality_mode = data.video_quality_mode;
    this.bitrate = data.bitrate;
    this.user_limit = data.user_limit;
    this.nsfw = data.nsfw;
    this.rate_limit_per_user = data.rate_limit_per_user;
    this.topic = data.topic;
    this.invites = data.invites;
    this.retention_policy_id = data.retention_policy_id;
    this.messages = data.messages;
    this.voice_states = data.voice_states;
    this.read_states = data.read_states;
    this.webhooks = data.webhooks;
    this.flags = data.flags;
    this.default_thread_rate_limit_per_user =
      data.default_thread_rate_limit_per_user;

    // this.storeCreated();
  }

  // storeCreated() {
  //   this.logger.debug(`Store created for channel ${this.id}`);
  // }
}
