export interface IUserSettings {
  index: string;
  afk_timeout: number;
  allow_accessibility_detection: boolean;
  animate_emoji: boolean;
  animate_stickers: number;
  contact_sync_enabled: boolean;
  convert_emoticons: boolean;

  custom_status: ICustomStatus | null;
  default_guilds_restricted: boolean;
  detect_platform_accounts: boolean;
  developer_mode: boolean;
  disable_games_tab: boolean;
  enable_tts_command: boolean;
  explicit_content_filter: number;

  friend_source_flags: IFriendSourceFlags;
  gateway_connected: boolean;
  gif_auto_play: boolean;

  guild_folders: IGuildFolder[];

  guild_positions: string[];
  inline_attachment_media: boolean;
  inline_embed_media: boolean;
  locale: string;
  message_display_compact: boolean;
  native_phone_integration_enabled: boolean;
  render_embeds: boolean;
  render_reactions: boolean;

  restricted_guilds: string[];
  show_current_game: boolean;
  status: "online" | "offline" | "dnd" | "idle" | "invisible";
  stream_notifications_enabled: boolean;
  theme: "dark" | "light";
  timezone_offset: number;
}

interface ICustomStatus {
  emoji_id?: string;
  emoji_name?: string;
  expires_at?: number;
  text?: string;
}

interface IGuildFolder {
  color: number;
  guild_ids: string[];
  id: number;
  name: string;
}

interface IFriendSourceFlags {
  all: boolean;
}
