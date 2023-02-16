import {
  Attachment,
  Channel,
  Embed,
  Guild,
  InteractionType,
  Message,
  MessageComponent,
  MessageType,
  Reaction,
  Role,
  Sticker,
  User,
} from "@puyodead1/fosscord-types";
import { action, observable } from "mobx";
import BaseStore from "./BaseStore";

export default class MessageStore extends BaseStore {
  id: string;
  channel_id?: string | undefined;
  guild_id?: string | undefined;
  guild?: Guild | undefined;
  author_id?: string | undefined;
  author?: User | undefined;
  member_id?: string | undefined;
  webhook_id?: string | undefined;
  application_id?: string | undefined;
  @observable content?: string | undefined;
  timestamp: Date;
  @observable edited_timestamp?: Date | undefined;
  tts?: boolean | undefined;
  mention_everyone?: boolean | undefined;
  @observable mentions: User[];
  @observable mention_roles: Role[];
  @observable mention_channels: Channel[];
  @observable sticker_items?: Sticker[] | undefined;
  @observable attachments?: Attachment[] | undefined;
  @observable embeds: Embed[];
  @observable reactions: Reaction[];
  nonce?: string | undefined;
  @observable pinned?: boolean | undefined;
  type: MessageType;
  activity?: { type: number; party_id: string } | undefined;
  @observable flags?: string | undefined;
  message_reference?:
    | {
        message_id: string;
        channel_id?: string | undefined;
        guild_id?: string | undefined;
      }
    | undefined;
  interaction?:
    | { id: string; type: InteractionType; name: string; user_id: string }
    | undefined;
  @observable components?: MessageComponent[] | undefined;

  constructor(data: Message) {
    super();

    this.id = data.id;
    this.channel_id = data.channel_id;
    this.guild_id = data.guild_id;
    this.guild = data.guild;
    this.author_id = data.author_id;
    this.author = data.author;
    this.member_id = data.member_id;
    this.webhook_id = data.webhook_id;
    this.application_id = data.application_id;
    this.content = data.content;
    this.timestamp = new Date(data.timestamp as any as string);
    this.edited_timestamp = data.edited_timestamp
      ? new Date(data.edited_timestamp as any as string)
      : undefined;
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
  update(message: Message) {
    Object.assign(this, message);
  }
}
