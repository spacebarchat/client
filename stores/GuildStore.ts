import {
  APIChannel,
  APIEmoji,
  APIGuildMember,
  APIRole,
  APISticker,
  GuildFeature,
} from "discord-api-types/v9";
import { observable, ObservableMap } from "mobx";
import { APIGuild } from "../interfaces/api/Guild";
import { GatewayGuildCreateDispatchData } from "../interfaces/gateway/Gateway";
import BaseStore from "./BaseStore";

export default class GuildStore
  extends BaseStore
  implements
    Omit<
      APIGuild,
      "channels" | "emojis" | "members" | "roles" | "stickers" | "properties"
    >
{
  @observable application_command_counts?: { 1: number; 2: number; 3: number }; // ????????????
  @observable channels: ObservableMap<string, APIChannel>;
  @observable data_mode: string; // what is this
  @observable emojis: ObservableMap<string, APIEmoji>;
  @observable guild_scheduled_events: unknown[]; // TODO
  @observable id: string;
  @observable large: boolean | undefined;
  @observable lazy: boolean;
  @observable member_count: number | undefined;
  @observable members: ObservableMap<string, APIGuildMember>;
  @observable premium_subscription_count: number | undefined;
  @observable name: string;
  @observable description?: string | null;
  @observable icon?: string | null;
  @observable splash?: string | null;
  @observable banner?: string | null;
  @observable features: GuildFeature[];
  @observable preferred_locale?: string | null;
  @observable owner_id?: string | null;
  @observable application_id?: string | null;
  @observable afk_channel_id?: string | null;
  @observable afk_timeout: number | undefined;
  @observable system_channel_id?: string | null;
  @observable verification_level: number | undefined;
  @observable explicit_content_filter: number | undefined;
  @observable default_message_notifications: number | undefined;
  @observable mfa_level: number | undefined;
  @observable vanity_url_code?: string | null;
  @observable premium_tier: number | undefined;
  @observable premium_progress_bar_enabled: boolean;
  @observable system_channel_flags: number | undefined;
  @observable discovery_splash?: string | null;
  @observable rules_channel_id?: string | null;
  @observable public_updates_channel_id?: string | null;
  @observable max_video_channel_users: number | undefined;
  @observable max_members: number | undefined;
  @observable nsfw_level: number | undefined;
  @observable hub_type?: unknown | null; // ????
  @observable roles: ObservableMap<string, APIRole>;
  @observable stage_instances: unknown[];
  @observable stickers: ObservableMap<string, APISticker>;
  @observable threads: unknown[];
  @observable version: string;

  constructor(guild: GatewayGuildCreateDispatchData | APIGuild) {
    super();

    this.application_command_counts = guild.application_command_counts;
    this.channels = observable.map(
      guild.channels.map((channel) => [channel.id, channel])
    );
    this.data_mode = guild.data_mode;
    this.emojis = observable.map(
      guild.emojis.map((emoji) => [emoji.id, emoji])
    );
    this.guild_scheduled_events = guild.guild_scheduled_events;
    this.id = guild.id;
    this.large = guild.large;
    this.lazy = guild.lazy;
    this.member_count = guild.member_count;
    if (guild.members)
      this.members = observable.map(
        guild.members.map((member) => [member.id, member])
      );
    else this.members = observable.map();
    this.premium_subscription_count = guild.premium_subscription_count;
    this.name = guild.properties.name;
    this.description = guild.properties.description;
    this.icon = guild.properties.icon;
    this.splash = guild.properties.splash;
    this.banner = guild.properties.banner;
    this.features = guild.properties.features;
    this.preferred_locale = guild.properties.preferred_locale;
    this.owner_id = guild.properties.owner_id;
    this.application_id = guild.properties.application_id;
    this.afk_channel_id = guild.properties.afk_channel_id;
    this.afk_timeout = guild.properties.afk_timeout;
    this.system_channel_id = guild.properties.system_channel_id;
    this.verification_level = guild.properties.verification_level;
    this.explicit_content_filter = guild.properties.explicit_content_filter;
    this.default_message_notifications =
      guild.properties.default_message_notifications;
    this.mfa_level = guild.properties.mfa_level;
    this.vanity_url_code = guild.properties.vanity_url_code;
    this.premium_tier = guild.properties.premium_tier;
    this.premium_progress_bar_enabled =
      guild.properties.premium_progress_bar_enabled;
    this.system_channel_flags = guild.properties.system_channel_flags;
    this.discovery_splash = guild.properties.discovery_splash;
    this.rules_channel_id = guild.properties.rules_channel_id;
    this.public_updates_channel_id = guild.properties.public_updates_channel_id;
    this.max_video_channel_users = guild.properties.max_video_channel_users;
    this.max_members = guild.properties.max_members;
    this.nsfw_level = guild.properties.nsfw_level;
    this.hub_type = guild.properties.hub_type;
    this.roles = observable.map(guild.roles.map((role) => [role.id, role]));
    this.stage_instances = guild.stage_instances;
    this.stickers = observable.map(
      guild.stickers.map((sticker) => [sticker.id, sticker])
    );
    this.threads = guild.threads;
    this.version = guild.version;
  }
}
