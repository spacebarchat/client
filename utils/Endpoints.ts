const Endpoints = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  TOTP: "/auth/mfa/totp",
  GUILD_ICON: (guildId: string, iconHash: string) =>
    `/icons/${guildId}/${iconHash}.png`,
};

export default Endpoints;
