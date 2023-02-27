import {
  APIUser,
  UserFlags,
  UserPremiumType,
} from '@puyodead1/fosscord-api-types/v9';

export default class {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  avatarDecoration?: unknown;
  email: string | null = null;
  verified: boolean = false;
  bot: boolean = false;
  system: boolean = false;
  mfaEnabled: boolean = false;
  premiumType?:
    | UserPremiumType.NitroClassic
    | UserPremiumType.Nitro
    | UserPremiumType.NitroBasic;
  flags?: UserFlags;
  publicFlags?: UserFlags;
  //   phone: string | null;
  //   nsfwAllowed: boolean | null;

  constructor(user: APIUser) {
    this.id = user.id;
    this.username = user.username;
    this.discriminator = user.discriminator;
    this.avatar = user.avatar;
    // this.avatarDecoration = user.avatar_decoration;
    if (user.email) {
      this.email = user.email;
    }
    if (user.verified) {
      this.verified = user.verified;
    }
    if (user.bot) {
      this.bot = user.bot;
    }
    if (user.system) {
      this.system = user.system;
    }
    if (user.mfa_enabled) {
      this.mfaEnabled = user.mfa_enabled;
    }
    if (user.premium_type) {
      this.premiumType = user.premium_type;
    }
    if (user.flags) {
      this.flags = user.flags;
    }
    if (user.public_flags) {
      this.publicFlags = user.public_flags;
    }
    // this.phone = user.phone;
    // this.nsfwAllowed = user.nsfw_allowed;
  }

  // hasFlag
  // isStaff
  // hasAnyStaffLevel
}
