import {
  APIActionRowComponent,
  APIApplication,
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
import { action } from "mobx";
import BaseStore from "./BaseStore";

export default class MessageStore extends BaseStore implements APIMessage {
  id: string;
  channel_id: string;
  author: APIUser;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: APIUser[];
  mention_roles: string[];
  mention_channels?: APIChannelMention[] | undefined;
  attachments: APIAttachment[];
  embeds: APIEmbed[];
  reactions?: APIReaction[] | undefined;
  nonce?: string | number | undefined;
  pinned: boolean;
  webhook_id?: string | undefined;
  type: MessageType;
  activity?: APIMessageActivity | undefined;
  application?: Partial<APIApplication> | undefined;
  application_id?: string | undefined;
  message_reference?: APIMessageReference | undefined;
  flags?: MessageFlags | undefined;
  referenced_message?: APIMessage | null | undefined;
  interaction?: APIMessageInteraction | undefined;
  thread?: APIChannel | undefined;
  components?:
    | APIActionRowComponent<APIMessageActionRowComponent>[]
    | undefined;
  sticker_items?: APIStickerItem[] | undefined;
  stickers?: APISticker[] | undefined;
  position?: number | undefined;

  constructor(data: APIMessage) {
    super();

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
