import { Snowflake } from "@puyodead1/fosscord-api-types/globals";

export const APIVersion = "9";

export type DefaultUserAvatarAssets = 0 | 1 | 2 | 3 | 4 | 5;

export type EmojiFormat = Exclude<ImageFormat, ImageFormat.Lottie>;
export type GuildIconFormat = Exclude<ImageFormat, ImageFormat.Lottie>;
export type GuildSplashFormat = Exclude<
  ImageFormat,
  ImageFormat.Lottie | ImageFormat.GIF
>;
export type GuildDiscoverySplashFormat = Exclude<
  ImageFormat,
  ImageFormat.Lottie | ImageFormat.GIF
>;
export type GuildBannerFormat = Exclude<ImageFormat, ImageFormat.Lottie>;
export type UserBannerFormat = Exclude<ImageFormat, ImageFormat.Lottie>;
export type DefaultUserAvatar = Extract<ImageFormat, ImageFormat.PNG>;
export type UserAvatarFormat = Exclude<ImageFormat, ImageFormat.Lottie>;
export type GuildMemberAvatarFormat = Exclude<ImageFormat, ImageFormat.Lottie>;
export type ApplicationIconFormat = Exclude<
  ImageFormat,
  ImageFormat.Lottie | ImageFormat.GIF
>;
export type ApplicationCoverFormat = Exclude<
  ImageFormat,
  ImageFormat.Lottie | ImageFormat.GIF
>;
export type ApplicationAssetFormat = Exclude<
  ImageFormat,
  ImageFormat.Lottie | ImageFormat.GIF
>;
export type AchievementIconFormat = Exclude<
  ImageFormat,
  ImageFormat.Lottie | ImageFormat.GIF
>;
export type StickerPackBannerFormat = Exclude<
  ImageFormat,
  ImageFormat.Lottie | ImageFormat.GIF
>;
export type TeamIconFormat = Exclude<
  ImageFormat,
  ImageFormat.Lottie | ImageFormat.GIF
>;
export type StickerFormat = Extract<
  ImageFormat,
  ImageFormat.PNG | ImageFormat.Lottie | ImageFormat.GIF
>;
export type RoleIconFormat = Exclude<
  ImageFormat,
  ImageFormat.Lottie | ImageFormat.GIF
>;
export type GuildScheduledEventCoverFormat = Exclude<
  ImageFormat,
  ImageFormat.Lottie | ImageFormat.GIF
>;
export type GuildMemberBannerFormat = Exclude<ImageFormat, ImageFormat.Lottie>;

export enum ImageFormat {
  JPEG = "jpeg",
  PNG = "png",
  WebP = "webp",
  GIF = "gif",
  Lottie = "json",
}

export interface CDNQuery {
  /**
   * The returned image can have the size changed by using this query parameter
   *
   * Image size can be any power of two between 16 and 4096
   */
  size?: number;
}

export const Routes = {
  login() {
    return "/auth/login";
  },
  register() {
    return "/auth/register";
  },
  totp() {
    return "/auth/mfa/totp";
  },
  minVersion(os: "android" | "ios") {
    // TODO: this route should be implemented in fosscord-server and then implemented for mobile versions of the client
    return `/apps/${os}/versions.json`;
  },
  /**
   * Route for:
   * - GET  `/channels/{channel.id}/messages`
   * - POST `/channels/{channel.id}/messages`
   */
  channelMessages(channelId: Snowflake) {
    return `/channels/${channelId}/messages` as const;
  },
};

export const CDNRoutes = {
  /**
   * Route for:
   * - GET `/guilds/{guild.id}/icons/{guild.id}.{png|jpeg|webp|gif}`
   *
   * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
   *
   * This route supports the extensions: PNG, JPEG, WebP, GIF
   */
  guildIcon(
    guildId: Snowflake,
    guildIcon: string,
    format: GuildIconFormat = ImageFormat.PNG
  ) {
    return `/icons/${guildId}/${guildIcon}.${format}` as const;
  },
  /**
   * Route for:
   * - GET `/embed/avatars/{user.discriminator % 6}.png`
   *
   * The `userDiscriminator` parameter should be the user discriminator modulo 5 (e.g. 1337 % 6 = 5)
   *
   * This route supports the extension: PNG
   */
  defaultUserAvatar(userDiscriminator: DefaultUserAvatarAssets) {
    return `/embed/avatars/${userDiscriminator}.png` as const;
  },

  /**
   * Route for:
   * - GET `/avatars/{user.id}/{user.avatar}.{png|jpeg|webp|gif}`
   *
   * As this route supports GIFs, the hash will begin with `a_` if it is available in GIF format
   *
   * This route supports the extensions: PNG, JPEG, WebP, GIF
   */
  userAvatar(
    userId: Snowflake,
    userAvatar: string,
    format: UserAvatarFormat = ImageFormat.PNG
  ) {
    return `/avatars/${userId}/${userAvatar}.${format}` as const;
  },
};
