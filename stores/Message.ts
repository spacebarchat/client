import {
  APIActionRowComponent,
  APIAttachment,
  APIChannel,
  APIChannelMention,
  APIEmbed,
  APIMessage,
  APIMessageActionRowComponent,
  APIMessageActivity,
  APIMessageInteraction,
  APIMessageReference,
  APIReaction,
  APISticker,
  APIStickerItem,
  APIUser,
  MessageFlags,
  MessageType,
} from "@puyodead1/fosscord-api-types/v9";
import { action, observable } from "mobx";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";

export default class Message extends BaseStore implements APIMessage {
  private readonly domain: DomainStore;

  id: string;
  channel_id: string;
  author: APIUser;
  @observable content: string;
  timestamp: string;
  @observable edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  @observable mentions: APIUser[];
  @observable mention_roles: string[];
  @observable mention_channels?: APIChannelMention[] | undefined;
  @observable attachments: APIAttachment[];
  @observable embeds: APIEmbed[];
  @observable reactions?: APIReaction[] | undefined;
  nonce?: string | number | undefined;
  @observable pinned: boolean;
  @observable webhook_id?: string | undefined;
  type: MessageType;
  @observable activity?: APIMessageActivity | undefined;
  application_id?: string | undefined;
  message_reference?: APIMessageReference | undefined;
  @observable flags?: MessageFlags | undefined;
  referenced_message?: APIMessage | null | undefined;
  @observable interaction?: APIMessageInteraction | undefined;
  @observable thread?: APIChannel | undefined;
  @observable components?:
    | APIActionRowComponent<APIMessageActionRowComponent>[]
    | undefined;
  @observable sticker_items?: APIStickerItem[] | undefined;
  @observable stickers?: APISticker[] | undefined;
  @observable position?: number | undefined;

  constructor(domain: DomainStore, data: APIMessage) {
    super();
    this.domain = domain;

    this.id = data.id;
    this.channel_id = data.channel_id;
    this.author = data.author;
    this.webhook_id = data.webhook_id;
    this.application_id = data.application_id;
    this.content = data.content;
    this.timestamp = data.timestamp;
    this.edited_timestamp = data.edited_timestamp;
    this.tts = data.tts;
    this.mention_everyone = data.mention_everyone;
    this.mentions = data.mentions;
    this.mention_roles = data.mention_roles;
    this.mention_channels = data.mention_channels;
    this.sticker_items = data.sticker_items;
    this.attachments = data.attachments;
    this.embeds = data.embeds;
    this.reactions = data.reactions;
    this.nonce = data.nonce;
    this.pinned = data.pinned;
    this.type = data.type;
    this.activity = data.activity;
    this.flags = data.flags;
    this.message_reference = data.message_reference;
    this.interaction = data.interaction;
    this.components = data.components;
  }

  @action
  update(message: APIMessage) {
    Object.assign(this, message);
  }
}
