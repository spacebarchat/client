import {
  APIChannel,
  APIInvite,
  APIOverwrite,
  APIReadState,
  APIUser,
  APIWebhook,
  ChannelType,
  GatewayVoiceState,
  RESTGetAPIChannelMessagesResult
} from "@puyodead1/fosscord-api-types/v9";
import { action, observable } from "mobx";
import { Routes } from "../utils/Endpoints";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";
import MessagesStore from "./MessagesStore";

export default class ChannelStore extends BaseStore {
  id: string;
  created_at: string;
  name?: string;
  icon?: string | null;
  type: ChannelType;
  recipients?: APIUser[];
  last_message_id?: string;
  guild_id?: string;
  parent_id: string;
  owner_id?: string;
  last_pin_timestamp?: number;
  default_auto_archive_duration?: number;
  position: number;
  permission_overwrites?: APIOverwrite[];
  video_quality_mode?: number;
  bitrate?: number;
  user_limit?: number;
  nsfw: boolean;
  rate_limit_per_user?: number;
  topic?: string;
  invites?: APIInvite[];
  retention_policy_id?: string;
  voice_states?: GatewayVoiceState[];
  read_states?: APIReadState[];
  webhooks?: APIWebhook[];
  flags: number;
  default_thread_rate_limit_per_user: number;
  @observable messages: MessagesStore = new MessagesStore();
  private hasFetchedMessages: boolean = false;

  constructor(data: APIChannel) {
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
    // makeObservable(this, {
    //   messages: observable,
    //   getChannelMessages: action,
    // });

    //
    if (data.messages) this.messages.addAll(data.messages);

    // this.storeCreated();
  }

  // storeCreated() {
  //   this.logger.debug(`Store created for channel ${this.id}`);
  // }

  @action
  async getChannelMessages(domain: DomainStore, limit?: number) {
    if (this.hasFetchedMessages) return;

    this.logger.info(`Fetching messags for ${this.id}`);
    const messages = await domain.rest.get<RESTGetAPIChannelMessagesResult>(
      Routes.channelMessages(this.id),
      {
        limit: limit || 50,
      }
    );
    this.messages.addAll(
      messages.filter((x) => !this.messages.has(x.id)).reverse()
      // .sort((a, b) => {
      //   const aTimestamp = new Date(a.timestamp as unknown as string);
      //   const bTimestamp = new Date(b.timestamp as unknown as string);
      //   return aTimestamp.getTime() - bTimestamp.getTime();
      // })
    );
    this.hasFetchedMessages = true;
  }
}
