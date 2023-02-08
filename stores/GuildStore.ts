import {
  APIEmoji,
  APIGuild,
  APIGuildWelcomeScreen,
  APIRole,
  APISticker,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildFeature,
  GuildHubType,
  GuildMFALevel,
  GuildNSFWLevel,
  GuildPremiumTier,
  GuildSystemChannelFlags,
  GuildVerificationLevel,
} from "discord-api-types/v9";
import { makeObservable, observable } from "mobx";
import BaseStore from "./BaseStore";

export default class GuildStore
  extends BaseStore
  implements Omit<APIGuild, "roles" | "emojis" | "stickers">
{
  @observable icon_hash?: string | null | undefined;
  @observable discovery_splash: string | null;
  @observable owner_id: string;
  @observable permissions?: string | undefined;
  @observable region: string;
  @observable afk_channel_id: string | null;
  @observable afk_timeout: 60 | 300 | 900 | 1800 | 3600;
  @observable widget_enabled?: boolean | undefined;
  @observable widget_channel_id?: string | null | undefined;
  @observable verification_level: GuildVerificationLevel;
  @observable default_message_notifications: GuildDefaultMessageNotifications;
  @observable explicit_content_filter: GuildExplicitContentFilter;
  @observable roles: Map<string, APIRole> = new Map();
  @observable emojis: Map<string, APIEmoji> = new Map();
  @observable features: GuildFeature[];
  @observable mfa_level: GuildMFALevel;
  @observable application_id: string | null;
  @observable system_channel_id: string | null;
  @observable system_channel_flags: GuildSystemChannelFlags;
  @observable rules_channel_id: string | null;
  @observable max_presences?: number | null | undefined;
  @observable max_members?: number | undefined;
  @observable vanity_url_code: string | null;
  @observable description: string | null;
  @observable banner: string | null;
  @observable premium_tier: GuildPremiumTier;
  @observable premium_subscription_count?: number | undefined;
  @observable preferred_locale: string;
  @observable public_updates_channel_id: string | null;
  @observable max_video_channel_users?: number | undefined;
  @observable approximate_member_count?: number | undefined;
  @observable approximate_presence_count?: number | undefined;
  @observable welcome_screen?: APIGuildWelcomeScreen | undefined;
  @observable nsfw_level: GuildNSFWLevel;
  @observable stickers: Map<string, APISticker> = new Map();
  @observable premium_progress_bar_enabled: boolean;
  @observable hub_type: GuildHubType | null;
  @observable name: string;
  @observable icon: string | null;
  @observable splash: string | null;
  @observable id: string;

  constructor(data: APIGuild) {
    super();
    this.icon_hash = data.icon_hash;
    this.discovery_splash = data.discovery_splash;
    this.owner_id = data.owner_id;
    this.permissions = data.permissions;
    this.region = data.region;
    this.afk_channel_id = data.afk_channel_id;
    this.afk_timeout = data.afk_timeout;
    this.widget_enabled = data.widget_enabled;
    this.widget_channel_id = data.widget_channel_id;
    this.verification_level = data.verification_level;
    this.default_message_notifications = data.default_message_notifications;
    this.explicit_content_filter = data.explicit_content_filter;
    this.roles = new Map(Object.entries(data.roles));
    this.emojis = new Map(Object.entries(data.emojis));
    this.features = data.features;
    this.mfa_level = data.mfa_level;
    this.application_id = data.application_id;
    this.system_channel_id = data.system_channel_id;
    this.system_channel_flags = data.system_channel_flags;
    this.rules_channel_id = data.rules_channel_id;
    this.max_presences = data.max_presences;
    this.max_members = data.max_members;
    this.vanity_url_code = data.vanity_url_code;
    this.description = data.description;
    this.banner = data.banner;
    this.premium_tier = data.premium_tier;
    this.premium_subscription_count = data.premium_subscription_count;
    this.preferred_locale = data.preferred_locale;
    this.public_updates_channel_id = data.public_updates_channel_id;
    this.max_video_channel_users = data.max_video_channel_users;
    this.approximate_member_count = data.approximate_member_count;
    this.approximate_presence_count = data.approximate_presence_count;
    this.welcome_screen = data.welcome_screen;
    this.nsfw_level = data.nsfw_level;
    this.stickers = new Map(Object.entries(data.stickers));
    this.premium_progress_bar_enabled = data.premium_progress_bar_enabled;
    this.hub_type = data.hub_type;
    this.name = data.name;
    this.icon = data.icon;
    this.splash = data.splash;
    this.id = data.id;

    makeObservable(this);
  }
}
