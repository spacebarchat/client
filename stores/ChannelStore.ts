import {
  ChannelPermissionOverwrite,
  ChannelType,
  Invite,
  ReadState,
  Recipient,
  VoiceState,
  Webhook,
} from "@puyodead1/fosscord-types";
import { action, observable } from "mobx";
import { IAPIGetChannelMessagesResult } from "../interfaces/api";
import { ChannelOmit } from "../interfaces/Gateway";
import { Routes } from "../utils/Endpoints";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";
import MessagesStore from "./MessagesStore";

export default class ChannelStore extends BaseStore {
  id: string;
  created_at: Date;
  @observable name?: string | undefined;
  @observable icon?: string | null | undefined;
  type: ChannelType;
  @observable recipients?: Recipient[] | undefined;
  @observable last_message_id?: string | undefined;
  guild_id?: string | undefined;
  @observable parent_id: string;
  owner_id?: string | undefined;
  @observable last_pin_timestamp?: number | undefined;
  @observable default_auto_archive_duration?: number | undefined;
  @observable position?: number | undefined;
  @observable permission_overwrites?: ChannelPermissionOverwrite[] | undefined;
  @observable video_quality_mode?: number | undefined;
  @observable bitrate?: number | undefined;
  @observable user_limit?: number | undefined;
  @observable nsfw: boolean;
  @observable rate_limit_per_user?: number | undefined;
  @observable topic?: string | undefined;
  @observable invites?: Invite[] | undefined;
  retention_policy_id?: string | undefined;
  @observable messages: MessagesStore = new MessagesStore();
  @observable voice_states?: VoiceState[] | undefined;
  @observable read_states?: ReadState[] | undefined;
  webhooks?: Webhook[] | undefined;
  @observable flags: number;
  default_thread_rate_limit_per_user: number;
  private hasFetchedMessages: boolean = false;

  constructor(data: ChannelOmit) {
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
    this.parent_id = data.parent_id;
    this.owner_id = data.owner_id;
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
    if (data.messages) this.messages.addAll(data.messages);
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

  @action
  async getChannelMessages(domain: DomainStore, limit?: number) {
    if (this.hasFetchedMessages) return;

    this.logger.info(`Fetching messags for ${this.id}`);
    const messages = await domain.rest.get<IAPIGetChannelMessagesResult>(
      Routes.channelMessages(this.id),
      {
        limit: limit || 50,
      }
    );
    this.messages.addAll(
      messages.filter((x) => !this.messages.has(x.id))
      // .sort((a, b) => {
      //   const aTimestamp = new Date(a.timestamp as unknown as string);
      //   const bTimestamp = new Date(b.timestamp as unknown as string);
      //   return aTimestamp.getTime() - bTimestamp.getTime();
      // })
    );
    this.hasFetchedMessages = true;
  }
}
