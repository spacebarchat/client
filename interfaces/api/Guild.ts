import {
  APIChannel,
  APIEmoji,
  APIGuildMember,
  APIRole,
  APISticker,
  GuildFeature,
} from "discord-api-types/v9";

export interface APIGuild {
  application_command_counts?: { 1: number; 2: number; 3: number }; // ????????????
  channels: APIChannel[];
  data_mode: string; // what is this
  emojis: APIEmoji[];
  guild_scheduled_events: unknown[]; // TODO
  id: string;
  large: boolean | undefined;
  lazy: boolean;
  member_count: number | undefined;
  members: APIGuildMember[];
  premium_subscription_count: number | undefined;
  properties: {
    name: string;
    description?: string | null;
    icon?: string | null;
    splash?: string | null;
    banner?: string | null;
    features: GuildFeature[];
    preferred_locale?: string | null;
    owner_id?: string | null;
    application_id?: string | null;
    afk_channel_id?: string | null;
    afk_timeout: number | undefined;
    system_channel_id?: string | null;
    verification_level: number | undefined;
    explicit_content_filter: number | undefined;
    default_message_notifications: number | undefined;
    mfa_level: number | undefined;
    vanity_url_code?: string | null;
    premium_tier: number | undefined;
    premium_progress_bar_enabled: boolean;
    system_channel_flags: number | undefined;
    discovery_splash?: string | null;
    rules_channel_id?: string | null;
    public_updates_channel_id?: string | null;
    max_video_channel_users: number | undefined;
    max_members: number | undefined;
    nsfw_level: number | undefined;
    hub_type?: unknown | null; // ????
  };
  roles: APIRole[];
  stage_instances: unknown[];
  stickers: APISticker[];
  threads: unknown[];
  version: string;
}
