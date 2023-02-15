import {
  Ban,
  Channel,
  Emoji,
  Guild,
  Invite,
  Member,
  Role,
  Sticker,
  VoiceState,
  Webhook,
} from "@puyodead1/fosscord-types";
import { action, makeObservable, observable } from "mobx";
import {
  GatewayGuildMemberListUpdateDispatchData,
  GatewayGuildModifyDispatchData,
} from "../interfaces/Gateway";
import BaseStore from "./BaseStore";
import ChannelsStore from "./ChannelsStore";
import GuildMemberListStore from "./GuildMemberListStore";

export default class GuildStore extends BaseStore {
  id: string;
  @observable afk_channel_id?: string | undefined;
  @observable afk_timeout?: number | undefined;
  @observable bans: Ban[];
  @observable banner?: string | undefined;
  @observable default_message_notifications?: number | undefined;
  @observable description?: string | undefined;
  @observable discovery_splash?: string | undefined;
  @observable explicit_content_filter?: number | undefined;
  @observable features: string[];
  @observable primary_category_id?: string | undefined;
  @observable icon?: string | undefined;
  @observable large?: boolean | undefined;
  @observable max_members?: number | undefined;
  @observable max_presences?: number | undefined;
  @observable max_video_channel_users?: number | undefined;
  @observable member_count?: number | undefined;
  @observable presence_count?: number | undefined;
  @observable members: Member[];
  @observable roles: Role[];
  @observable channels: ChannelsStore = new ChannelsStore();
  @observable template_id?: string | undefined;
  @observable emojis: Emoji[];
  @observable stickers: Sticker[];
  @observable invites: Invite[];
  @observable voice_states: VoiceState[];
  @observable webhooks: Webhook[];
  @observable mfa_level?: number | undefined;
  @observable name: string;
  @observable owner_id?: string | undefined;
  @observable preferred_locale?: string | undefined;
  @observable premium_subscription_count?: number | undefined;
  @observable premium_tier?: number | undefined;
  @observable public_updates_channel_id: string;
  @observable public_updates_channel?: Channel | undefined;
  @observable rules_channel_id?: string | undefined;
  @observable region?: string | undefined;
  @observable splash?: string | undefined;
  @observable system_channel_id?: string | undefined;
  @observable system_channel_flags?: number | undefined;
  @observable unavailable: boolean;
  @observable verification_level?: number | undefined;
  @observable welcome_screen: {
    enabled: boolean;
    description: string;
    welcome_channels: {
      description: string;
      emoji_id?: string | undefined;
      emoji_name?: string | undefined;
      channel_id: string;
    }[];
  };
  @observable widget_channel_id?: string | undefined;
  @observable widget_enabled: boolean;
  @observable nsfw_level?: number | undefined;
  @observable nsfw: boolean;
  @observable parent?: string | undefined;
  @observable permissions?: number | undefined;
  @observable premium_progress_bar_enabled: boolean;

  @observable memberList: GuildMemberListStore | null = null;

  constructor(guild: Guild) {
    super();

    this.id = guild.id;
    this.afk_channel_id = guild.afk_channel_id;
    this.afk_timeout = guild.afk_timeout;
    this.bans = guild.bans;
    this.banner = guild.banner;
    this.default_message_notifications = guild.default_message_notifications;
    this.description = guild.description;
    this.discovery_splash = guild.discovery_splash;
    this.explicit_content_filter = guild.explicit_content_filter;
    this.features = guild.features;
    this.primary_category_id = guild.primary_category_id;
    this.icon = guild.icon;
    this.large = guild.large;
    this.max_members = guild.max_members;
    this.max_presences = guild.max_presences;
    this.max_video_channel_users = guild.max_video_channel_users;
    this.member_count = guild.member_count;
    this.presence_count = guild.presence_count;
    this.members = guild.members;
    this.roles = guild.roles;
    guild.channels.forEach((channel) => this.channels.add(channel));
    this.template_id = guild.template_id;
    this.emojis = guild.emojis;
    this.stickers = guild.stickers;
    this.invites = guild.invites;
    this.voice_states = guild.voice_states;
    this.webhooks = guild.webhooks;
    this.mfa_level = guild.mfa_level;
    this.name = guild.name;
    this.owner_id = guild.owner_id;
    this.preferred_locale = guild.preferred_locale;
    this.premium_subscription_count = guild.premium_subscription_count;
    this.premium_tier = guild.premium_tier;
    this.public_updates_channel_id = guild.public_updates_channel_id;
    this.public_updates_channel = guild.public_updates_channel;
    this.rules_channel_id = guild.rules_channel_id;
    this.region = guild.region;
    this.splash = guild.splash;
    this.system_channel_id = guild.system_channel_id;
    this.system_channel_flags = guild.system_channel_flags;
    this.unavailable = guild.unavailable;
    this.verification_level = guild.verification_level;
    this.welcome_screen = guild.welcome_screen;
    this.widget_channel_id = guild.widget_channel_id;
    this.widget_enabled = guild.widget_enabled;
    this.nsfw_level = guild.nsfw_level;
    this.nsfw = guild.nsfw;
    this.parent = guild.parent;
    this.permissions = guild.permissions;
    this.premium_progress_bar_enabled = guild.premium_progress_bar_enabled;

    makeObservable(this);
  }

  @action
  update(data: GatewayGuildModifyDispatchData) {
    Object.assign(this, data);
  }

  @action
  onMemberListUpdate(data: GatewayGuildMemberListUpdateDispatchData) {
    if (this.memberList) {
      this.memberList.update(data);
    } else {
      this.memberList = new GuildMemberListStore(data);
    }
  }
}
